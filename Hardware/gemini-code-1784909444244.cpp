#include "HX711.h"
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// --- กำหนดพินอุปกรณ์ ---
const int DOUT_PIN = 19;
const int SCK_PIN = 18;
const int BUTTON_TARE = 5;
const int BUTTON_SEND = 4;

HX711 scale;

// 🎯 นำค่าตัวเลขที่คุณหาได้มาใส่ตรงนี้
float CALIBRATION_FACTOR = 460.00; 

// --- การตั้งค่า BLE (Bluetooth Low Energy) ---
BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;

// กำหนดรหัสประจำตัว (UUID) ให้เครื่องชั่ง (เว็บแอปจะใช้รหัสนี้วิ่งหาเครื่องชั่ง)
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// คลาสสำหรับตรวจสอบสถานะว่า "มีมือถือ/เว็บ มาเชื่อมต่อบลูทูธหรือยัง?"
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("\n[BLE] 🟢 อุปกรณ์เชื่อมต่อสำเร็จแล้ว!");
    };
    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("\n[BLE] 🔴 ขาดการเชื่อมต่อ... กำลังเปิดสัญญาณให้สแกนใหม่");
      pServer->startAdvertising(); // เปิดให้สแกนใหม่ทันทีเมื่อหลุด
    }
};

unsigned long lastPrintTime = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("\n--- FeedMe Smart Scale (BLE Mode) ---");

  pinMode(BUTTON_TARE, INPUT_PULLUP);
  pinMode(BUTTON_SEND, INPUT_PULLUP);

  // 1. เริ่มต้นการทำงานของตาชั่ง
  scale.begin(DOUT_PIN, SCK_PIN);
  Serial.print("[SYSTEM] กำลังตรวจสอบการเชื่อมต่อ Load Cell... ");
  long timeout = millis();
  bool isConnected = false;
  
  while(millis() - timeout < 3000) {
    if (scale.is_ready()) {
      isConnected = true;
      break;
    }
    delay(100);
  }

  if (isConnected) {
    Serial.println("สำเร็จ! [OK]");
    scale.set_scale(CALIBRATION_FACTOR);
    scale.tare(); 
    Serial.println("[SYSTEM] เซ็ตน้ำหนักเริ่มต้นเป็น 0 กรัม พร้อมใช้งาน!");
  } else {
    Serial.println("ล้มเหลว! [ERROR]");
    while(1) delay(1000); // หยุดการทำงานถ้าเซนเซอร์มีปัญหา
  }

  // 2. เริ่มต้นการตั้งค่า Bluetooth BLE
  Serial.println("\n[BLE] กำลังเปิดสัญญาณ Bluetooth...");
  BLEDevice::init("FeedMe Scale"); // ชื่ออุปกรณ์ที่จะแสดงตอนสแกน
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks()); // ผูกคลาสเช็คสถานะการเชื่อมต่อ

  // สร้าง Service และ Characteristic (ช่องทางส่งข้อมูล)
  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_NOTIFY // ยอมให้ตาชั่ง "เด้งเตือน" ข้อมูลไปที่แอปได้
                    );
                    
  pCharacteristic->addDescriptor(new BLE2902());
  pService->start();

  // เปิดให้มือถือหรือเว็บมองเห็นตาชั่งนี้ได้ (Advertising)
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  
  Serial.println("[BLE] สัญญาณพร้อมแล้ว! เปิดเว็บหรือแอปเพื่อสแกนหา 'FeedMe Scale' ได้เลย");
  Serial.println("====================================\n");
}

void loop() {
  float currentWeight = scale.get_units(3);
  if (currentWeight < 0) currentWeight = 0.0;

  // แสดงผลน้ำหนักแบบเรียลไทม์ทุกๆ 1 วินาที
  if (millis() - lastPrintTime > 1000) {
    Serial.print("น้ำหนักปัจจุบัน: ");
    Serial.print(currentWeight, 1);
    Serial.print(" g  |  สถานะ BLE: ");
    Serial.println(deviceConnected ? "เชื่อมต่อแล้ว 🟢" : "รอการเชื่อมต่อ 🔴");
    lastPrintTime = millis();
  }

  // --- ตรวจจับปุ่ม TARE (หักน้ำหนักภาชนะ) ---
  if (digitalRead(BUTTON_TARE) == LOW) {
    Serial.println("\n[ACTION] กดปุ่ม TARE -> เซ็ตน้ำหนักเป็น 0...\n");
    scale.tare();
    delay(500); 
  }

  // --- ตรวจจับปุ่ม SEND (ส่งข้อมูลผ่าน Bluetooth) ---
  if (digitalRead(BUTTON_SEND) == LOW) {
    Serial.println("\n[ACTION] กดปุ่ม SEND -> เตรียมส่งข้อมูล...");
    
    // สร้างข้อความ Payload แบบ JSON ตามฟอร์แมตที่เรากำหนดไว้
    String payload = "{\"weight\":" + String(currentWeight, 1) + "}";
    Serial.println("ข้อมูลที่จะส่ง: " + payload);

    // ตรวจสอบว่าตอนนี้มีแอปเชื่อมต่อ Bluetooth อยู่หรือไม่?
    if (deviceConnected) {
        // 1. นำข้อความยัดใส่ช่องสัญญาณ (Characteristic)
        pCharacteristic->setValue(payload.c_str());
        
        // 2. สั่ง Notify ให้ข้อมูล "เด้ง" ไปเข้าแอปหรือหน้าเว็บทันที
        pCharacteristic->notify();
        Serial.println("[BLE] 🚀 ยิงข้อมูลเข้าแอปเรียบร้อยแล้ว!\n");
    } else {
        // กรณีที่เราเผลอกดปุ่ม แต่ยังไม่ได้เปิดแอปเชื่อมต่อ
        Serial.println("[BLE] ⚠️ ส่งไม่ได้! ยังไม่มีแอปเชื่อมต่อกับตาชั่ง\n");
    }
    
    delay(1000); // หน่วงเวลาป้องกันการกดส่งรัวๆ
  }
}