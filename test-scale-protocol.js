/**
 * test-scale-protocol.js
 * Static verification test for ESP32 BLE GATT UUIDs and payload schema.
 * 
 * Verifies that:
 * 1. Hardware/Hardware_Scale.ino defines the exact Service UUID, Characteristic UUID,
 *    advertised name ("FeedMe Scale"), and standardized JSON payload:
 *    {"weight": <number>, "unit": "g", "stable": <boolean>}
 * 2. Hardware/README.md and ARCHITECTURE.md document the same UUIDs, advertised name,
 *    pinouts, and JSON payload format.
 */

const fs = require('fs');
const path = require('path');

const EXPECTED_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const EXPECTED_CHAR_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const EXPECTED_DEVICE_NAME = 'FeedMe Scale';

const rootDir = __dirname;
const inoPath = path.join(rootDir, 'Hardware', 'Hardware_Scale.ino');
const readmePath = path.join(rootDir, 'Hardware', 'README.md');
const archPath = path.join(rootDir, 'ARCHITECTURE.md');

let failures = [];
let passes = [];

function assert(condition, message) {
  if (condition) {
    passes.push(message);
    console.log(`  ✓ ${message}`);
  } else {
    failures.push(message);
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('=== FeedMe 2.0 Smart Scale BLE Protocol & Firmware Verification ===\n');

// 1. Verify Hardware/Hardware_Scale.ino
console.log('Checking Hardware/Hardware_Scale.ino:');
if (!fs.existsSync(inoPath)) {
  failures.push(`File not found: ${inoPath}`);
  console.error(`  ✗ FAIL: File not found: ${inoPath}`);
} else {
  const inoContent = fs.readFileSync(inoPath, 'utf8');

  assert(
    inoContent.includes(EXPECTED_SERVICE_UUID),
    `Firmware contains Service UUID: ${EXPECTED_SERVICE_UUID}`
  );

  assert(
    inoContent.includes(EXPECTED_CHAR_UUID),
    `Firmware contains Characteristic UUID: ${EXPECTED_CHAR_UUID}`
  );

  assert(
    inoContent.includes(`"${EXPECTED_DEVICE_NAME}"`),
    `Firmware initializes BLE device with name: "${EXPECTED_DEVICE_NAME}"`
  );

  assert(
    /["']weight["']/.test(inoContent) &&
    /["']unit["']/.test(inoContent) &&
    /["']stable["']/.test(inoContent),
    'Firmware BLE payload formats standardized fields: "weight", "unit", and "stable"'
  );

  assert(
    inoContent.includes('BUTTON_TARE') && inoContent.includes('BUTTON_SEND'),
    'Firmware defines TARE and SEND button controls'
  );
}

// 2. Verify Hardware/README.md
console.log('\nChecking Hardware/README.md:');
if (!fs.existsSync(readmePath)) {
  failures.push(`File not found: ${readmePath}`);
  console.error(`  ✗ FAIL: File not found: ${readmePath}`);
} else {
  const readmeContent = fs.readFileSync(readmePath, 'utf8');

  assert(
    readmeContent.includes(EXPECTED_SERVICE_UUID),
    `README contains Service UUID: ${EXPECTED_SERVICE_UUID}`
  );

  assert(
    readmeContent.includes(EXPECTED_CHAR_UUID),
    `README contains Characteristic UUID: ${EXPECTED_CHAR_UUID}`
  );

  assert(
    readmeContent.includes(EXPECTED_DEVICE_NAME),
    `README contains Advertised Device Name: "${EXPECTED_DEVICE_NAME}"`
  );

  // Validate JSON payload sample
  const jsonMatch = readmeContent.match(/```json\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch) {
    try {
      const payload = JSON.parse(jsonMatch[1]);
      assert(
        typeof payload.weight === 'number' &&
        payload.unit === 'g' &&
        typeof payload.stable === 'boolean',
        'README sample JSON payload matches schema {"weight": number, "unit": "g", "stable": boolean}'
      );
    } catch (e) {
      assert(false, `README JSON payload could not be parsed: ${e.message}`);
    }
  } else {
    assert(false, 'README does not contain a ```json sample code block');
  }
}

// 3. Verify ARCHITECTURE.md
console.log('\nChecking ARCHITECTURE.md:');
if (!fs.existsSync(archPath)) {
  failures.push(`File not found: ${archPath}`);
  console.error(`  ✗ FAIL: File not found: ${archPath}`);
} else {
  const archContent = fs.readFileSync(archPath, 'utf8');

  assert(
    archContent.includes(EXPECTED_SERVICE_UUID),
    `ARCHITECTURE.md contains Service UUID: ${EXPECTED_SERVICE_UUID}`
  );

  assert(
    archContent.includes(EXPECTED_CHAR_UUID),
    `ARCHITECTURE.md contains Characteristic UUID: ${EXPECTED_CHAR_UUID}`
  );

  assert(
    archContent.includes(EXPECTED_DEVICE_NAME),
    `ARCHITECTURE.md contains Advertised Device Name: "${EXPECTED_DEVICE_NAME}"`
  );

  const jsonMatches = archContent.match(/```json\s*(\{[\s\S]*?\})\s*```/g) || [];
  let foundValidGattSample = false;
  for (const m of jsonMatches) {
    const raw = m.replace(/```json\s*/, '').replace(/\s*```/, '');
    try {
      const p = JSON.parse(raw);
      if (typeof p.weight === 'number' && p.unit === 'g' && typeof p.stable === 'boolean') {
        foundValidGattSample = true;
        break;
      }
    } catch (_) {}
  }
  assert(
    foundValidGattSample,
    'ARCHITECTURE.md documents standard BLE JSON payload {"weight": number, "unit": "g", "stable": boolean}'
  );
}

console.log(`\n==================================================`);
console.log(`Summary: ${passes.length} Passed, ${failures.length} Failed`);

if (failures.length > 0) {
  console.error(`\nDiscrepancies identified:`);
  failures.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
} else {
  console.log(`\nAll BLE GATT specifications and firmware protocols standardized!`);
  process.exit(0);
}
