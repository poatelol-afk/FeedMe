/*
 * FeedMe Smart Scale — Dual Mode (BLE + Wi-Fi HTTP)
 * ──────────────────────────────────────────────────
 * ปุ่ม TARE  → หักน้ำหนักภาชนะ (เซ็ต 0)
 * ปุ่ม SEND  → ส่งข้อมูลพร้อมกัน 2 ช่องทาง:
 *              1. BLE Notify  → เว็บ/แอปบลูทูธ (เดิม)
 *              2. HTTP POST   → FeedMe API → Supabase (ใหม่)
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
//  ⚙️  ตั้งค่าตรงนี้ก่อนอัปโหลด
// ═══════════════════════════════════════════════════

// --- Wi-Fi ---
const char* WIFI_SSID     = "YOUR_WIFI_NAME";     // ← ใส่ชื่อ Wi-Fi
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"; // ← ใส่รหัส Wi-Fi

// --- FeedMe API ---
// ถ้าทดสอบ Local ใส่ IP ของคอมที่รันเว็บ (ดูจาก npm run dev)
// ถ้า Deploy แล้วใส่ https://your-domain.com
const char* API_URL   = "http://192.168.1.127:3000/api/scale/reading";
const char* DEVICE_ID = "scale-01"; // ชื่ออุปกรณ์ (เปลี่ยนได้ตามใจ)

// Session cookie: เปิด Browser → Login FeedMe → F12 → Application
// → Cookies → copy value ของ cookie ที่ขึ้นต้นว่า "sb-..."
const char* SESSION_COOKIE = "sb-ptvjyexxxsfwjszdzthw-auth-token=PASTE_YOUR_TOKEN_HERE";

// ═══════════════════════════════════════════════════
//  📌 ค่าเดิม — ไม่เปลี่ยน
// ═══════════════════════════════════════════════════

// --- กำหนดพินอุปกรณ์ (เดิม) ---
const int DOUT_PIN    = 19;
const int SCK_PIN     = 18;
const int BUTTON_TARE = 5;
const int BUTTON_SEND = 4;

// --- Calibration Factor (เดิม) ---
float CALIBRATION_FACTOR = 460.00;

// --- BLE UUID (เดิม) ---
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// ═══════════════════════════════════════════════════

HX711 scale;

BLEServer*         pServer         = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;

unsigned long lastPrintTime = 0;

// ─── BLE Callbacks (เดิม) ────────────────────────
class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("\n[BLE] 🟢 อุปกรณ์เชื่อมต่อสำเร็จแล้ว!");
  }
  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("\n[BLE] 🔴 ขาดการเชื่อมต่อ... กำลังเปิดสัญญาณให้สแกนใหม่");
    pServer->startAdvertising();
  }
};

// ─── ฟังก์ชันส่ง HTTP POST ไป FeedMe API (ใหม่) ──
bool sendToFeedMe(float weightKg) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] ⚠️  Wi-Fi ไม่ได้เชื่อมต่อ — ข้ามการส่ง HTTP");
    return false;
  }

  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Cookie", SESSION_COOKIE);

  // สร้าง JSON payload
  StaticJsonDocument<128> doc;
  doc["device_id"] = DEVICE_ID;
  doc["weight_kg"] = round(weightKg * 10.0f) / 10.0f;  // ปัดเป็น 1 ทศนิยม
  doc["stable"]    = true;

  String payload;
  serializeJson(doc, payload);
  Serial.println("[HTTP] Payload: " + payload);

  int httpCode = http.POST(payload);
  String response = http.getString();

  if (httpCode == 200) {
    Serial.println("[HTTP] ✅ ส่งสำเร็จ! บันทึกลง Supabase แล้ว");
    Serial.println("[HTTP] Response: " + response);
  } else {
    Serial.printf("[HTTP] ❌ ส่งไม่สำเร็จ (HTTP %d)\n", httpCode);
    Serial.println("[HTTP] Response: " + response);
  }

  http.end();
  return (httpCode == 200);
}

// ─────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  Serial.println("\n--- FeedMe Smart Scale (BLE + Wi-Fi Mode) ---");

  pinMode(BUTTON_TARE, INPUT_PULLUP);
  pinMode(BUTTON_SEND, INPUT_PULLUP);

  // 1. เริ่มต้นตาชั่ง (เดิม)
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
    Serial.println("ล้มเหลว! [ERROR]");
    while (1) delay(1000);
  }

  // 2. เชื่อม Wi-Fi (ใหม่)
  Serial.printf("\n[WiFi] กำลังเชื่อมต่อ '%s'...", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int wifiTimeout = 0;
  while (WiFi.status() != WL_CONNECTED && wifiTimeout < 20) {
    delay(500);
    Serial.print(".");
    wifiTimeout++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[WiFi] ✅ เชื่อมต่อสำเร็จ! IP: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n[WiFi] ⚠️  เชื่อมต่อไม่ได้ — จะทำงานในโหมด BLE อย่างเดียว");
  }

  // 3. เริ่ม BLE (เดิม)
  Serial.println("\n[BLE] กำลังเปิดสัญญาณ Bluetooth...");
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

  Serial.println("[BLE] สัญญาณพร้อมแล้ว! เปิดเว็บหรือแอปเพื่อสแกนหา 'FeedMe Scale' ได้เลย");
  Serial.println("====================================\n");
}

// ─────────────────────────────────────────────────
void loop() {
  float currentWeight = scale.get_units(3);
  if (currentWeight < 0) currentWeight = 0.0;

  // แสดงน้ำหนักแบบเรียลไทม์ทุกๆ 1 วินาที (เดิม)
  if (millis() - lastPrintTime > 1000) {
    Serial.printf("น้ำหนักปัจจุบัน: %.1f g  |  BLE: %s  |  WiFi: %s\n",
      currentWeight,
      deviceConnected ? "เชื่อมต่อแล้ว 🟢" : "รอ 🔴",
      WiFi.status() == WL_CONNECTED ? "✅" : "❌"
    );
    lastPrintTime = millis();
  }

  // --- ปุ่ม TARE (เดิม) ─────────────────────────
  if (digitalRead(BUTTON_TARE) == LOW) {
    Serial.println("\n[ACTION] กดปุ่ม TARE -> เซ็ตน้ำหนักเป็น 0...\n");
    scale.tare();
    delay(500);
  }

  // --- ปุ่ม SEND — ส่งทั้ง BLE และ HTTP ─────────
  if (digitalRead(BUTTON_SEND) == LOW) {
    Serial.println("\n[ACTION] กดปุ่ม SEND -> เตรียมส่งข้อมูล...");

    // แปลง g → kg สำหรับ API (เว็บใช้ kg)
    float weightKg = currentWeight / 1000.0f;
    String blePaload = "{\"weight\":" + String(currentWeight, 1) + "}";

    Serial.println("ข้อมูลที่จะส่ง (g): " + blePaload);
    Serial.printf("น้ำหนัก (kg): %.1f kg\n", weightKg);

    // ── ช่องทางที่ 1: BLE Notify (เดิม) ──────────
    if (deviceConnected) {
      pCharacteristic->setValue(blePaload.c_str());
      pCharacteristic->notify();
      Serial.println("[BLE] 🚀 ยิงข้อมูลเข้าแอปเรียบร้อยแล้ว!");
    } else {
      Serial.println("[BLE] ⚠️  ส่งไม่ได้! ยังไม่มีแอปเชื่อมต่อกับตาชั่ง");
    }

    // ── ช่องทางที่ 2: HTTP POST → FeedMe API (ใหม่) ──
    if (weightKg > 0.01f) {
      Serial.println("[HTTP] กำลังส่งไป FeedMe...");
      sendToFeedMe(weightKg);
    } else {
      Serial.println("[HTTP] ⚠️  น้ำหนักน้อยเกินไป — ไม่ส่ง");
    }

    delay(1000); // ป้องกันกดรัว (เดิม)
  }
}
