# ⚖️ FeedMe Smart Kitchen Scale Firmware (`feedme-hardware`)

ESP32-C3 microcontroller firmware for the **FeedMe 2.0 Smart Kitchen Scale**, transmitting live ingredient weights in grams via Bluetooth Low Energy (BLE GATT) directly into the **`feedme-mobile` (Flutter)** Smart Kitchen cooking mode.

---

## 🔌 Hardware Schematics & Pinout

| Component | ESP32-C3 Pin | Purpose |
| :--- | :--- | :--- |
| **HX711 DOUT** | GPIO 19 | Load cell data output |
| **HX711 SCK** | GPIO 18 | Serial clock |
| **Push Button (TARE)** | GPIO 5 | Zero out bowl / plate weight (Internal Pull-Up) |
| **Push Button (SEND)** | GPIO 4 | Lock ingredient weight & notify Flutter app via BLE |
| **Status LED** | GPIO 8 | BLE connection and tare status indicator |

---

## 📡 Bluetooth Low Energy (BLE GATT) Protocol

- **Advertised Device Name:** `FeedMe Scale`
- **Primary Service UUID:** `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- **Weight Characteristic UUID:** `beb5483e-36e1-4688-b7f5-ea07361b26a8`
- **Payload (UTF-8 JSON):**
```json
{
  "weight": 185.5,
  "unit": "g",
  "stable": true
}
```

### Transmission Triggers:
1. **Auto-Stable Detection:** Transmits automatically with `"stable": true` once the measured weight stabilizes ($\pm 0.5\text{ g}$ hold for $1.2\text{ s}$).
2. **SEND Button (GPIO 4):** Immediately locks and notifies current weight to `feedme-mobile`.
3. **TARE Button (GPIO 5):** Tares scale to $0.0\text{ g}$ and notifies app with zeroed reading.

---

## ⚙️ Calibration

- Default calibration factor: `460.00`
- Adjust `CALIBRATION_FACTOR` in `Hardware_Scale.ino` using a known reference weight (e.g., 500g).
