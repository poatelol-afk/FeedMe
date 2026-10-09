# ⚖️ FeedMe Smart Food Scale Firmware & Hardware (`Hardware`)

ESP32-C3 microcontroller firmware for the **FeedMe IoT Smart Food Scale** with dual-mode BLE GATT and Wi-Fi transmission.

---

## 🔌 Hardware Schematics & Pinout

| Component | ESP32-C3 Pin | Purpose |
| :--- | :--- | :--- |
| **HX711 DOUT** | GPIO 19 | Load cell data output |
| **HX711 SCK** | GPIO 18 | Serial clock |
| **Push Button (TARE)** | GPIO 5 | Zero out container / plate (Internal Pull-Up) |
| **Push Button (SEND)** | GPIO 4 | Trigger BLE notify & HTTP POST (Internal Pull-Up) |
| **Status LED** | GPIO 8 | BLE connection and tare indicator |

---

## 📡 Wireless Protocols

1. **Bluetooth Low Energy (BLE):**
   - Device Name: `FeedMe Scale`
   - Primary Service: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
   - Characteristic: `beb5483e-36e1-4688-b7f5-ea07361b26a8`
   - Payload: `{"weight": 185.5, "unit": "g"}`
2. **Wi-Fi HTTP Post (Fallback):**
   - Connects to local Wi-Fi and posts to `http://<web-server-ip>:3000/api/scale/reading`
   - Payload: `{"device_id": "scale-01", "weight_kg": 0.1855, "stable": true}`

---

## ⚙️ Calibration

- Initial calibration factor: `460.00`
- Adjust `CALIBRATION_FACTOR` in `sketch_jul24a.ino` / PlatformIO configuration using a certified calibration weight (e.g., 500g).
