/*
 * FeedMe 2.0 Smart Kitchen Scale Firmware (ESP32-C3 + HX711)
 * ────────────────────────────────────────────────────────────
 * Standardized BLE GATT Protocol:
 *   - Advertised Device Name: "FeedMe Scale"
 *   - Primary Service UUID:   "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
 *   - Weight Characteristic:  "beb5483e-36e1-4688-b7f5-ea07361b26a8"
 *   - Notification Payload:   {"weight": 185.5, "unit": "g", "stable": true}
 *
 * Controls & Pinout (ESP32-C3):
 *   - HX711 DOUT: GPIO 19
 *   - HX711 SCK:  GPIO 18
 *   - ปุ่ม TARE (GPIO 5): หักน้ำหนักภาชนะ (เซ็ต 0 กรัม)
 *   - ปุ่ม SEND (GPIO 4): ล็อกค่าน้ำหนักส่งเข้า FeedMe Mobile ทาง BLE (+ Wi-Fi Fallback)
 */

#include "HX711.h"
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ═══════════════════════════════════════════════════
//  ⚙️  การตั้งค่าอุปกรณ์ & เครือข่าย
// ═══════════════════════════════════════════════════

// --- Wi-Fi Fallback Settings ---
const char* WIFI_SSID     = "YOUR_WIFI_NAME";     // ใส่ชื่อ Wi-Fi สำหรับ fallback
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"; // ใส่รหัส Wi-Fi

// --- FeedMe API Endpoint ---
const char* API_URL   = "http://192.168.1.127:3000/api/scale/reading";
const char* DEVICE_ID = "scale-01";
const char* SESSION_COOKIE = "sb-ptvjyexxxsfwjszdzthw-auth-token=PASTE_YOUR_TOKEN_HERE";

// ═══════════════════════════════════════════════════
//  📌 Pinout & Hardware Calibration
// ═══════════════════════════════════════════════════

const int DOUT_PIN    = 19;
const int SCK_PIN     = 18;
const int BUTTON_TARE = 5;
const int BUTTON_SEND = 4;

// Calibration factor สำหรับ Load Cell 5kg / 10kg
float CALIBRATION_FACTOR = 460.00;

// ═══════════════════════════════════════════════════
//  📡 BLE GATT Definitions (Standardized FeedMe 2.0)
// ═══════════════════════════════════════════════════

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

HX711 scale;

BLEServer*         pServer         = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;

unsigned long lastPrintTime = 0;

// Stability detection parameters
float lastStableWeight = -1.0f;
float lastReadWeight = 0.0f;
unsigned long stableStartTime = 0;
bool isCurrentlyStable = false;
const float STABILITY_DELTA_THRESHOLD = 0.5f; // grams difference to consider steady
const unsigned long STABILITY_HOLD_MS = 1200; // time in ms to confirm stable reading
const float MIN_REPORT_WEIGHT = 5.0f;          // minimum weight in grams for auto-report

// ─── BLE Server Callbacks ────────────────────────
class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("\n[BLE] 🟢 อุปกรณ์เชื่อมต่อสำเร็จแล้ว! (FeedMe Mobile Connected)");
  }
  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("\n[BLE] 🔴 ขาดการเชื่อมต่อ... กำลังเปิดสัญญาณให้สแกนใหม่");
    pServer->startAdvertising();
  }
};

// ─── สร้างและส่ง Standardized JSON Payload ผ่าน BLE ───
String formatBlePayload(float weightGrams, bool isStable) {
  StaticJsonDocument<128> doc;
  doc["weight"] = round(weightGrams * 10.0f) / 10.0f;
  doc["unit"] = "g";
  doc["stable"] = isStable;

  String payload;
  serializeJson(doc, payload);
  return payload;
}

void notifyBleWeight(float weightGrams, bool isStable) {
  if (deviceConnected && pCharacteristic != NULL) {
    String payload = formatBlePayload(weightGrams, isStable);
    pCharacteristic->setValue(payload.c_str());
    pCharacteristic->notify();
    Serial.println("[BLE] 🚀 Notification Sent: " + payload);
  }
}

// ─── ฟังก์ชันส่ง HTTP POST สำรอง (Fallback) ──────
bool sendToFeedMe(float weightKg) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] ⚠️  Wi-Fi ไม่ได้เชื่อมต่อ — ข้ามการส่ง HTTP");
    return false;
  }

  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Cookie", SESSION_COOKIE);

  StaticJsonDocument<128> doc;
  doc["device_id"] = DEVICE_ID;
  doc["weight_kg"] = round(weightKg * 10.0f) / 10.0f;
  doc["stable"]    = true;

  String payload;
  serializeJson(doc, payload);
  Serial.println("[HTTP] Payload: " + payload);

  int httpCode = http.POST(payload);
  String response = http.getString();

  if (httpCode == 200) {
    Serial.println("[HTTP] ✅ ส่งสำเร็จ! บันทึกข้อมูลเรียบร้อย");
  } else {
    Serial.printf("[HTTP] ❌ ส่งไม่สำเร็จ (HTTP %d)\n", httpCode);
  }

  http.end();
  return (httpCode == 200);
}

// ─────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  Serial.println("\n--- FeedMe 2.0 Smart Kitchen Scale Firmware ---");

  pinMode(BUTTON_TARE, INPUT_PULLUP);
  pinMode(BUTTON_SEND, INPUT_PULLUP);

  // 1. ตรวจสอบการเชื่อมต่อ Load Cell (HX711)
  scale.begin(DOUT_PIN, SCK_PIN);
  Serial.print("[SYSTEM] กำลังตรวจสอบการเชื่อมต่อ Load Cell... ");

  long timeout = millis();
  bool isConnected = false;
  while (millis() - timeout < 3000) {
    if (scale.is_ready()) { isConnected = true; break; }
    delay(100);
  }

  if (isConnected) {
    Serial.println("สำเร็จ! [OK]");
    scale.set_scale(CALIBRATION_FACTOR);
    scale.tare();
    Serial.println("[SYSTEM] เซ็ตน้ำหนักเริ่มต้นเป็น 0 กรัม พร้อมใช้งาน!");
  } else {
    Serial.println("ล้มเหลว! [ERROR - กรุณาตรวจสอบสาย HX711]");
    while (1) delay(1000);
  }

  // 2. เริ่มต้น Bluetooth Low Energy (BLE GATT)
  Serial.println("\n[BLE] กำลังเปิดสัญญาณ Bluetooth Low Energy...");
  BLEDevice::init("FeedMe Scale");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService* pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_NOTIFY
  );
  pCharacteristic->addDescriptor(new BLE2902());
  pService->start();

  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  Serial.println("[BLE] สัญญาณพร้อมแล้ว! เปิดแอป FeedMe เพื่อเชื่อมต่อ 'FeedMe Scale'");

  // 3. เริ่มต้น Wi-Fi สำหรับโหมด Fallback (ออปชันเสริม)
  Serial.printf("\n[WiFi] กำลังเชื่อมต่อ '%s'...", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int wifiTimeout = 0;
  while (WiFi.status() != WL_CONNECTED && wifiTimeout < 10) {
    delay(500);
    Serial.print(".");
    wifiTimeout++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[WiFi] ✅ เชื่อมต่อสำเร็จ! IP: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n[WiFi] ⚠️  ไม่พบเครือข่าย — ทำงานในโหมด BLE GATT เดี่ยว (ประหยัดพลังงาน)");
  }

  Serial.println("==================================================\n");
}

// ─────────────────────────────────────────────────
void loop() {
  float currentWeight = scale.get_units(3);
  if (currentWeight < 0) currentWeight = 0.0;

  // แสดงน้ำหนักใน Serial Monitor ทุกๆ 1 วินาที
  if (millis() - lastPrintTime > 1000) {
    Serial.printf("น้ำหนักปัจจุบัน: %.1f g  |  BLE: %s  |  WiFi: %s\n",
      currentWeight,
      deviceConnected ? "เชื่อมต่อแล้ว 🟢" : "รอการเชื่อมต่อ 🔴",
      WiFi.status() == WL_CONNECTED ? "✅" : "❌"
    );
    lastPrintTime = millis();
  }

  // --- การตรวจจับน้ำหนักนิ่งอัตโนมัติ (Auto-Stable Detection) ---
  if (abs(currentWeight - lastReadWeight) < STABILITY_DELTA_THRESHOLD) {
    if (millis() - stableStartTime >= STABILITY_HOLD_MS) {
      if (!isCurrentlyStable && currentWeight >= MIN_REPORT_WEIGHT) {
        if (abs(currentWeight - lastStableWeight) >= 1.0f) {
          isCurrentlyStable = true;
          lastStableWeight = currentWeight;
          Serial.printf("\n[STABLE] ⚖️ ตรวจพบค่าน้ำหนักนิ่ง: %.1f g (แจ้งเตือน BLE)\n", currentWeight);
          notifyBleWeight(currentWeight, true);
        }
      }
    }
  } else {
    lastReadWeight = currentWeight;
    stableStartTime = millis();
    isCurrentlyStable = false;
  }

  // --- ปุ่ม TARE (GPIO 5): หักน้ำหนักภาชนะ ─────────
  if (digitalRead(BUTTON_TARE) == LOW) {
    Serial.println("\n[ACTION] กดปุ่ม TARE -> เซ็ตน้ำหนักเป็น 0.0 กรัม\n");
    scale.tare();
    lastStableWeight = 0.0f;
    isCurrentlyStable = false;
    notifyBleWeight(0.0f, true);
    delay(500); // Debounce
  }

  // --- ปุ่ม SEND (GPIO 4): ล็อกน้ำหนักส่งเข้าแอป ─────
  if (digitalRead(BUTTON_SEND) == LOW) {
    Serial.println("\n[ACTION] กดปุ่ม SEND -> ล็อกค่าน้ำหนักและส่งข้อมูล...");

    // ส่ง BLE Notify ไปยัง FeedMe Mobile
    if (deviceConnected) {
      notifyBleWeight(currentWeight, true);
      Serial.println("[BLE] 🚀 ส่งค่าน้ำหนักเข้า FeedMe Mobile สำเร็จ!");
    } else {
      Serial.println("[BLE] ⚠️  ยังไม่มีแอปเชื่อมต่อกับตาชั่ง");
    }

    // ส่ง HTTP POST สำรอง (ถ้าเปิด Wi-Fi)
    float weightKg = currentWeight / 1000.0f;
    if (weightKg > 0.01f && WiFi.status() == WL_CONNECTED) {
      Serial.println("[HTTP] ส่งข้อมูลผ่าน Wi-Fi HTTP...");
      sendToFeedMe(weightKg);
    }

    delay(1000); // ป้องกันกดซ้ำ
  }
}
