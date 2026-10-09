import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, Platform, PermissionsAndroid,
} from 'react-native';
import { decode as atob } from 'base-64';
import { colors, spacing, radius, fontSize } from '../lib/theme';

// UUID เดิมจาก ESP32 — ไม่ต้องแก้ Arduino เลย
const SERVICE_UUID        = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

type Status = 'idle' | 'scanning' | 'connecting' | 'connected' | 'error';

interface Props {
  onWeightReceived?: (grams: number) => void | Promise<void>;
}

// Lazy init — ไม่สร้างตอน module load เพื่อป้องกัน crash ใน Expo Go
let _manager: any = null;
function getManager() {
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
      Alert.alert('ไม่รองรับ', 'BLE ต้องใช้กับ APK ที่ build แล้วเท่านั้น\nไม่รองรับใน Expo Go');
      return;
    }

    const hasPermission = await requestBlePermissions();
    if (!hasPermission) {
      setErrorMsg('ไม่ได้รับอนุญาตใช้ Bluetooth');
      return;
    }

    try {
      const bleState = await manager.state();
      if (bleState !== 'PoweredOn') {
        Alert.alert('เปิด Bluetooth ก่อน', 'กรุณาเปิด Bluetooth บนมือถือ');
        return;
      }

      setStatus('scanning');
      scanActiveRef.current = true;
      scanTimeoutRef.current = setTimeout(() => {
        if (!scanActiveRef.current) return;
        stopScan(manager);
        if (isMountedRef.current) {
          setStatus('idle');
          setErrorMsg('ไม่พบเครื่องชั่ง — ลองกดใหม่อีกครั้ง');
        }
      }, 10000);

      manager.startDeviceScan(
        [SERVICE_UUID],
        { allowDuplicates: false },
        async (error: any, device: any) => {
          if (!isMountedRef.current) return;
          if (error) {
            stopScan(manager);
            setStatus('error');
            setErrorMsg(error.message ?? 'สแกน Bluetooth ไม่สำเร็จ');
            return;
          }

          // เจอ FeedMe Scale แล้ว!
          if (device?.name !== 'FeedMe Scale') return;

          stopScan(manager);
          setStatus('connecting');

          try {
            const connected = await device.connect();
            if (!isMountedRef.current) {
              await connected.cancelConnection();
              return;
            }
            deviceRef.current = connected;
            await connected.discoverAllServicesAndCharacteristics();
            setStatus('connected');

            // Subscribe รับ Notify เมื่อกดปุ่ม SEND บนเครื่องชั่ง
            monitorSubscriptionRef.current = connected.monitorCharacteristicForService(
              SERVICE_UUID,
              CHARACTERISTIC_UUID,
              (err: any, characteristic: any) => {
                if (!isMountedRef.current || err || !characteristic?.value) return;
                const raw = atob(characteristic.value);
                try {
                  const json = JSON.parse(raw);
                  let weightGrams = Number(json.weight);
                  const unit = typeof json.unit === 'string' ? json.unit.toLowerCase() : 'g';
                  if (unit === 'kg') weightGrams *= 1000;
                  else if (!['g', 'gram', 'grams'].includes(unit)) return;
                  if (!Number.isFinite(weightGrams) || weightGrams <= 0) return;

                  const finalWeightGrams = Math.round(weightGrams * 10) / 10;
                  setLastWeight(finalWeightGrams);
                  Promise.resolve(onWeightReceived?.(finalWeightGrams)).catch(error => {
                    console.error('[BLE] weight handler error:', error);
                  });
                } catch (e) { console.error('[BLE] parse error:', e); }
              },
            );

            disconnectSubscriptionRef.current = connected.onDisconnected(() => {
              if (!isMountedRef.current) return;
              monitorSubscriptionRef.current?.remove();
              monitorSubscriptionRef.current = null;
              disconnectSubscriptionRef.current = null;
              setStatus('idle');
              setErrorMsg('เครื่องชั่งหลุดการเชื่อมต่อ');
              deviceRef.current = null;
            });
          } catch (e: any) {
            monitorSubscriptionRef.current?.remove();
            disconnectSubscriptionRef.current?.remove();
            monitorSubscriptionRef.current = null;
            disconnectSubscriptionRef.current = null;
            try { await deviceRef.current?.cancelConnection(); } catch (_) {}
            deviceRef.current = null;
            if (isMountedRef.current) {
              setStatus('error');
              setErrorMsg(e.message ?? 'เชื่อมต่อไม่ได้');
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

  const isConnected  = status === 'connected';
  const isBusy       = status === 'scanning' || status === 'connecting';

  // Expo Go ไม่รองรับ native BLE — แสดง banner แทน
  if (!isBleAvailable) {
    return (
      <View style={[styles.card, { borderColor: colors.borderMid }]}>
        <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center' }}>
          🔵 BLE Scale ใช้ได้เฉพาะ APK จริง{"\n"}
          <Text style={{ fontSize: fontSize.xs }}>ไม่รองรับใน Expo Go</Text>
        </Text>
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

  errorText: { fontSize: fontSize.xs, color: colors.danger, marginTop: spacing.sm },
});
