import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, Platform, PermissionsAndroid,
} from 'react-native';
import { decode as atob } from 'base-64';
import { colors, spacing, radius, fontSize } from '../lib/theme';

// UUID เดิมจาก ESP32
const SERVICE_UUID        = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

type Status = 'idle' | 'scanning' | 'connecting' | 'connected' | 'mock-connected' | 'error';

interface Props {
  onWeightReceived?: (grams: number) => void | Promise<void>;
}

// Lazy init — ไม่สร้างตอน module load เพื่อป้องกัน crash ใน Expo Go และ Web
let _manager: any = null;
function getManager() {
  if (Platform.OS === 'web') return null;
  if (!_manager) {
    try {
      const { BleManager } = require('react-native-ble-plx');
      _manager = new BleManager();
    } catch (e) {
      return null;
    }
  }
  return _manager;
}

async function requestBlePermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  try {
    const apiLevel = Number(Platform.Version);
    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    const results = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);
    return Object.values(results).every(
      result => result === PermissionsAndroid.RESULTS.GRANTED,
    );
  } catch (error) {
    console.error('[BLE] permission error:', error);
    return false;
  }
}

export default function BleScaleCard({ onWeightReceived }: Props) {
  const [status, setStatus]       = useState<Status>('idle');
  const [lastWeight, setLastWeight] = useState<number | null>(null);
  const [errorMsg, setErrorMsg]   = useState('');
  const deviceRef = useRef<any>(null);
  const monitorSubscriptionRef = useRef<any>(null);
  const disconnectSubscriptionRef = useRef<any>(null);
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanActiveRef = useRef(false);
  const isMountedRef = useRef(true);
  const isBleAvailable = !!getManager();

  const stopScan = useCallback((manager: any = _manager) => {
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
    if (scanActiveRef.current) {
      manager?.stopDeviceScan();
      scanActiveRef.current = false;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopScan();
      monitorSubscriptionRef.current?.remove();
      disconnectSubscriptionRef.current?.remove();
      deviceRef.current?.cancelConnection().catch(() => {});
      deviceRef.current = null;
    };
  }, [stopScan]);

  const connect = useCallback(async () => {
    if (scanActiveRef.current || deviceRef.current) return;

    setErrorMsg('');
    const manager = getManager();
    if (!manager) {
      Alert.alert('ไม่รองรับ', 'BLE ต้องใช้กับ APK ที่ build แล้วเท่านั้น\nบน Web หรือ Expo Go สามารถใช้ปุ่มจำลองด้านล่างได้ทันที');
      return;
    }

    const hasPermission = await requestBlePermissions();
    if (!hasPermission) {
      setErrorMsg('ไม่ได้รับสิทธิ์ Bluetooth / Location');
      return;
    }

    setStatus('scanning');
    scanActiveRef.current = true;

    scanTimeoutRef.current = setTimeout(() => {
      stopScan(manager);
      if (isMountedRef.current && !deviceRef.current) {
        setStatus('error');
        setErrorMsg('ไม่พบ FeedMe Scale — เปิดเครื่องชั่งแล้วลองใหม่');
      }
    }, 12000);

    try {
      manager.startDeviceScan(
        [SERVICE_UUID],
        { allowDuplicates: false },
        async (error: any, scannedDevice: any) => {
          if (error) {
            stopScan(manager);
            if (isMountedRef.current) {
              setStatus('error');
              setErrorMsg(error.message ?? 'สแกนล้มเหลว');
            }
            return;
          }

          if (scannedDevice && scannedDevice.name === 'FeedMe Scale') {
            stopScan(manager);
            if (!isMountedRef.current) return;

            setStatus('connecting');
            try {
              const connected = await scannedDevice.connect();
              deviceRef.current = connected;

              disconnectSubscriptionRef.current = connected.onDisconnected(() => {
                if (isMountedRef.current) {
                  setStatus('idle');
                  setLastWeight(null);
                  setErrorMsg('เครื่องชั่งหลุดการเชื่อมต่อ');
                }
                deviceRef.current = null;
                monitorSubscriptionRef.current?.remove();
                disconnectSubscriptionRef.current?.remove();
              });

              await connected.discoverAllServicesAndCharacteristics();
              if (!isMountedRef.current) return;

              setStatus('connected');

              monitorSubscriptionRef.current = connected.monitorCharacteristicForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID,
                (charError: any, characteristic: any) => {
                  if (charError) return;
                  if (!characteristic?.value) return;

                  try {
                    const raw = atob(characteristic.value);
                    const json = JSON.parse(raw);
                    const weightVal = parseFloat(json.weight ?? json.weight_kg ?? 0);
                    if (isNaN(weightVal) || weightVal <= 0) return;

                    const finalWeight = Math.round(weightVal * 10) / 10;
                    if (isMountedRef.current) {
                      setLastWeight(finalWeight);
                    }
                    onWeightReceived?.(finalWeight);
                  } catch (e) {
                    console.error('[BLE] parse error:', e);
                  }
                },
              );
            } catch (connErr: any) {
              if (isMountedRef.current) {
                setStatus('error');
                setErrorMsg(connErr.message ?? 'เชื่อมต่อไม่สำเร็จ');
              }
              deviceRef.current = null;
            }
          }
        },
      );
    } catch (e: any) {
      stopScan(manager);
      setStatus('error');
      setErrorMsg(e.message ?? 'เริ่ม Bluetooth ไม่สำเร็จ');
    }
  }, [onWeightReceived, stopScan]);

  const disconnect = useCallback(async () => {
    stopScan();
    monitorSubscriptionRef.current?.remove();
    disconnectSubscriptionRef.current?.remove();
    monitorSubscriptionRef.current = null;
    disconnectSubscriptionRef.current = null;
    const device = deviceRef.current;
    deviceRef.current = null;
    try { await device?.cancelConnection(); } catch (_) {}
    setStatus('idle');
    setLastWeight(null);
    setErrorMsg('');
  }, [stopScan]);

  // Mock Scale Simulation Handler
  const sendMockWeight = (grams: number) => {
    setStatus('mock-connected');
    setLastWeight(grams);
    setErrorMsg('');
    onWeightReceived?.(grams);
  };

  const isConnected  = status === 'connected' || status === 'mock-connected';
  const isBusy       = status === 'scanning' || status === 'connecting';

  // Fallback for Web and Expo Go: Clean simulation controls
  if (!isBleAvailable) {
    return (
      <View style={[styles.card, isConnected && styles.cardConnected]}>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>⚖️</Text>
          </View>
          <View style={styles.info}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.title}>FeedMe Scale (Web Mode)</Text>
              <View style={styles.mockBadge}>
                <Text style={styles.mockBadgeText}>SIMULATOR</Text>
              </View>
            </View>
            <Text style={styles.sub}>
              {lastWeight ? `รับน้ำหนักจำลอง: ${lastWeight} g` : 'กดปุ่มด้านล่างเพื่อจำลองค่าน้ำหนัก'}
            </Text>
          </View>
        </View>

        <View style={styles.mockControlsRow}>
          <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>จำลองการชั่ง:</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[150, 240, 350].map((g) => (
              <TouchableOpacity
                key={g}
                style={styles.mockBtn}
                onPress={() => sendMockWeight(g)}
              >
                <Text style={styles.mockBtnText}>{g}g</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, isConnected && styles.cardConnected]}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>
            {isConnected ? '⚡' : isBusy ? '🔄' : '🔵'}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>
            {isConnected ? 'FeedMe Scale เชื่อมต่อแล้ว'
              : isBusy   ? (status === 'scanning' ? 'กำลังสแกน...' : 'กำลังเชื่อมต่อ...')
              : 'เชื่อมต่อเครื่องชั่ง (BLE)'}
          </Text>
          <Text style={styles.sub}>
            {isConnected
              ? (lastWeight ? `รับน้ำหนักล่าสุด: ${lastWeight} g` : 'กดปุ่ม SEND บนเครื่องชั่ง')
              : 'กดเพื่อสแกนหา FeedMe Scale'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.btn, isConnected && styles.btnDanger, isBusy && styles.btnDisabled]}
          onPress={isConnected ? disconnect : connect}
          disabled={isBusy}
        >
          {isBusy
            ? <ActivityIndicator size="small" color={colors.accent} />
            : <Text style={[styles.btnText, isConnected && { color: colors.danger }]}>
                {isConnected ? 'ตัดการเชื่อม' : 'เชื่อมต่อ'}
              </Text>
          }
        </TouchableOpacity>
      </View>

      {/* Quick Mock shortcut also available */}
      <View style={styles.mockControlsRow}>
        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Mock ด่วน:</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {[150, 240].map((g) => (
            <TouchableOpacity
              key={g}
              style={styles.mockBtn}
              onPress={() => sendMockWeight(g)}
            >
              <Text style={styles.mockBtnText}>{g}g</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {errorMsg ? (
        <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.borderSoft,
    padding: spacing.md,
  },
  cardConnected: { borderColor: colors.accentMid, backgroundColor: 'rgba(143,184,154,0.05)' },

  row:      { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.borderSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  icon:  { fontSize: 16 },
  info:  { flex: 1 },
  title: { fontSize: fontSize.sm, fontWeight: '500', color: colors.textPrimary },
  sub:   { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },

  btn: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.accent,
  },
  btnDanger:   { borderColor: 'rgba(220,60,60,0.3)' },
  btnDisabled: { opacity: 0.5 },
  btnText:     { fontSize: fontSize.xs, fontWeight: '500', color: colors.accent },

  mockBadge: {
    backgroundColor: 'rgba(201,169,110,0.15)',
    paddingHorizontal: 5, paddingVertical: 1,
    borderRadius: 4,
  },
  mockBadgeText: {
    fontSize: 9, fontWeight: '700', color: colors.gold, letterSpacing: 0.5,
  },

  mockControlsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: spacing.sm, paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: colors.borderSoft,
  },
  mockBtn: {
    paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: colors.bgElevated, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.borderSoft,
  },
  mockBtnText: {
    fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: '500',
  },

  errorText: { fontSize: fontSize.xs, color: colors.danger, marginTop: spacing.sm },
});
