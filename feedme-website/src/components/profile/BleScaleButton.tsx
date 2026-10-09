'use client';

import { useState, useCallback, useRef } from 'react';
import * as db from '@/lib/db';

// UUID จาก ESP32 (ตรงกับไฟล์ firmware)
const SERVICE_UUID        = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

type BleStatus = 'idle' | 'connecting' | 'connected' | 'mock-connected' | 'error';

interface Props {
  onWeightReceived: (kg: number) => void;
}

export default function BleScaleButton({ onWeightReceived }: Props) {
  const [status, setStatus] = useState<BleStatus>('idle');
  const [lastWeight, setLastWeight] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [mockWeightInput, setMockWeightInput] = useState<number>(250);
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const charRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  // รับข้อมูลจาก ESP32 เมื่อกดปุ่ม SEND
  const handleNotification = useCallback(async (event: Event) => {
    const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
    if (!value) return;

    const decoder = new TextDecoder();
    const text = decoder.decode(value);

    try {
      const json = JSON.parse(text);
      const rawWeight = parseFloat(json.weight ?? json.weight_kg ?? 0);
      if (isNaN(rawWeight) || rawWeight <= 0) return;

      const finalWeight = Math.round(rawWeight * 10) / 10;
      setLastWeight(finalWeight);

      await db.logWeightReading(finalWeight, 'scale', deviceRef.current?.name ?? 'ble-scale');
      onWeightReceived(finalWeight);
    } catch (e) {
      console.error('[BLE] Parse error:', e);
    }
  }, [onWeightReceived]);

  // ── เชื่อมต่อ BLE ──────────────────────────────────
  const connect = useCallback(async () => {
    if (!navigator.bluetooth) {
      setErrorMsg('Browser ไม่รองรับ Bluetooth — คุณสามารถใช้ปุ่ม Mock ด้านล่างได้ทันที');
      setStatus('error');
      return;
    }

    setStatus('connecting');
    setErrorMsg('');

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'FeedMe Scale' }],
        optionalServices: [SERVICE_UUID],
      });

      deviceRef.current = device;

      device.addEventListener('gattserverdisconnected', () => {
        setStatus('idle');
        setErrorMsg('เครื่องชั่งหลุดการเชื่อมต่อ');
        charRef.current = null;
      });

      const server  = await device.gatt!.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const char    = await service.getCharacteristic(CHARACTERISTIC_UUID);

      charRef.current = char;
      await char.startNotifications();
      char.addEventListener('characteristicvaluechanged', handleNotification);

      setStatus('connected');
    } catch (e: unknown) {
      const err = e as Error;
      if (err.name === 'NotFoundError') {
        setStatus('idle');
      } else {
        setErrorMsg(err.message ?? 'เชื่อมต่อไม่ได้');
        setStatus('error');
      }
    }
  }, [handleNotification]);

  // ── Mock Scale Simulation ─────────────────────────
  const sendMockReading = async (grams: number) => {
    setStatus('mock-connected');
    setLastWeight(grams);
    setErrorMsg('');
    await db.logWeightReading(grams, 'scale', 'feedme-scale-mock');
    onWeightReceived(grams);
  };

  const disconnect = useCallback(async () => {
    if (charRef.current) {
      charRef.current.removeEventListener('characteristicvaluechanged', handleNotification);
    }
    deviceRef.current?.gatt?.disconnect();
    deviceRef.current = null;
    charRef.current = null;
    setStatus('idle');
    setLastWeight(null);
  }, [handleNotification]);

  const isConnected = status === 'connected' || status === 'mock-connected';
  const isConnecting = status === 'connecting';

  return (
    <div style={{
      borderRadius: '16px',
      border: `1px solid ${isConnected ? 'rgba(143,184,154,0.35)' : 'var(--border-mid)'}`,
      background: isConnected ? 'rgba(143,184,154,0.05)' : 'var(--bg-surface)',
      padding: '16px 18px',
      transition: 'all 0.2s ease',
    }}>
      <div className="flex items-center justify-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '10px',
            background: isConnected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
            border: `1px solid ${isConnected ? 'rgba(143,184,154,0.3)' : 'var(--border-soft)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <span style={{ fontSize: '15px' }}>
              {isConnected ? '⚖️' : isConnecting ? '🔄' : '📡'}
            </span>
            {isConnected && (
              <span style={{
                position: 'absolute', inset: '-3px',
                borderRadius: '12px',
                border: '1.5px solid var(--accent)',
                opacity: 0.4,
                animation: 'pulse 2.5s ease-in-out infinite',
              }} />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
                {status === 'mock-connected'
                  ? 'FeedMe Scale (Mock Mode)'
                  : isConnected
                  ? 'FeedMe Scale เชื่อมต่อแล้ว'
                  : 'เครื่องชั่งดิจิทัล IoT'}
              </p>
              {status === 'mock-connected' && (
                <span style={{
                  fontSize: '9px', textTransform: 'uppercase', padding: '1px 5px',
                  borderRadius: '4px', background: 'var(--gold-soft)', color: 'var(--gold)',
                  letterSpacing: '0.05em', fontWeight: '600'
                }}>
                  Mocked
                </span>
              )}
            </div>
            <p style={{ fontSize: '11px', color: isConnected ? 'var(--accent)' : 'var(--text-muted)', marginTop: '2px' }}>
              {isConnected
                ? (lastWeight ? `รับค่าน้ำหนักล่าสุด: ${lastWeight} g` : 'พร้อมรับค่าน้ำหนัก')
                : isConnecting
                ? 'กำลังค้นหา FeedMe Scale...'
                : 'เชื่อมต่อผ่าน BLE หรือจำลองค่าน้ำหนัก'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={isConnected ? disconnect : connect}
            disabled={isConnecting}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: isConnected ? '1px solid rgba(220,60,60,0.3)' : '1px solid var(--border-strong)',
              background: isConnected ? 'transparent' : 'var(--bg-elevated)',
              color: isConnected ? 'var(--danger)' : 'var(--text-primary)',
              fontSize: '11px', fontWeight: '500',
              cursor: isConnecting ? 'default' : 'pointer',
              opacity: isConnecting ? 0.6 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {isConnected ? 'ปลดการเชื่อมต่อ' : 'ค้นหา BLE'}
          </button>
        </div>
      </div>

      {/* Mock Scale Quick Controls */}
      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          จำลองการชั่งอาหาร (Mock):
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[120, 200, 350].map((g) => (
            <button
              key={g}
              onClick={() => sendMockReading(g)}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-soft)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {g}g
            </button>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="number"
              value={mockWeightInput}
              onChange={(e) => setMockWeightInput(Number(e.target.value))}
              style={{
                width: '56px',
                fontSize: '11px',
                padding: '3px 6px',
                borderRadius: '6px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-soft)',
                color: 'var(--text-primary)',
                textAlign: 'center',
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>g</span>
            <button
              onClick={() => sendMockReading(mockWeightInput)}
              style={{
                fontSize: '11px',
                padding: '3px 9px',
                borderRadius: '6px',
                background: 'var(--accent)',
                color: '#0f1a10',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ส่งค่า
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <p style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '8px' }}>
          ⚠️ {errorMsg}
        </p>
      )}
    </div>
  );
}
