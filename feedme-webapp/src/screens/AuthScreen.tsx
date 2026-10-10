import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabase/client';
import { colors, spacing, radius, fontSize, button3D } from '../lib/theme';

export default function AuthScreen() {
  const [mode, setMode]         = useState<'login' | 'register'>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        Alert.alert('สมัครสมาชิกสำเร็จ!', 'กรุณาตรวจสอบ Email เพื่อยืนยัน หรือเข้าสู่ระบบได้ทันทีหากเปิด auto-confirm ไว้');
      }
    } catch (e: any) {
      Alert.alert('เกิดข้อผิดพลาด', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        {/* Duolingo Friendly Logo */}
        <View style={styles.logoBox}>
          <View style={styles.mascotCircle}>
            <Text style={styles.logoEmoji}>🦉</Text>
          </View>
          <Text style={styles.logoText}>FeedMe</Text>
          <Text style={styles.logoSub}>สนุกกับการดูแลหุ่นและสุขภาพทุกวัน!</Text>
        </View>

        {/* 3D Container Card */}
        <View style={styles.card3D}>
          {/* Tab switcher */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, mode === 'login' && styles.tabActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                เข้าสู่ระบบ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'register' && styles.tabActive]}
              onPress={() => setMode('register')}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                สมัครสมาชิก
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="user@example.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.btn3D, button3D.primary, loading && { opacity: 0.6 }]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#111111" />
                : <Text style={styles.btnText}>
                    {mode === 'login' ? 'เข้าสู่ระบบเลย ✨' : 'สร้างบัญชีผู้ใช้ใหม่ 🚀'}
                  </Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },

  logoBox: { alignItems: 'center', marginBottom: spacing.xl },
  mascotCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#a5ed6e',
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoEmoji: { fontSize: 44 },
  logoText: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  logoSub: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },

  card3D: {
    backgroundColor: '#ffffff',
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 5,
    padding: spacing.lg,
  },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  tabActive: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#d6d6d6',
  },
  tabText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '700',
  },
  tabTextActive: {
    color: colors.text,
    fontWeight: '800',
  },

  form: { gap: spacing.sm },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d6d6d6',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: '700',
  },

  btn3D: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  btnText: {
    color: '#111111',
    fontWeight: '800',
    fontSize: fontSize.sm,
    letterSpacing: 0.3,
  },
});
