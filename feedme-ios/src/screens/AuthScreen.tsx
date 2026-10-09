import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabase/client';
import { colors, spacing, radius, fontSize } from '../lib/theme';

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
        Alert.alert('สมัครสมาชิกสำเร็จ!', 'กรุณาตรวจสอบ Email เพื่อยืนยัน');
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
        {/* Logo */}
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🌿</Text>
          <Text style={styles.logoText}>FeedMe</Text>
          <Text style={styles.logoSub}>Your health companion</Text>
        </View>

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
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.6 }]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.bgBase} />
              : <Text style={styles.btnText}>
                  {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                </Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgBase },
  inner: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },

  logoBox: { alignItems: 'center', marginBottom: spacing.xxl },
  logoEmoji: { fontSize: 48, marginBottom: spacing.sm },
  logoText: {
    fontSize: 36, fontWeight: '300', letterSpacing: -1,
    color: colors.textPrimary,
  },
  logoSub: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 4 },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: 4,
    marginBottom: spacing.xl,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.md },
  tabActive: { backgroundColor: colors.accent },
  tabText: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '500' },
  tabTextActive: { color: colors.bgBase },

  form: { gap: spacing.sm },
  label: { fontSize: fontSize.xs, color: colors.textMuted, marginBottom: 2, marginTop: spacing.sm },
  input: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1, borderColor: colors.borderMid,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.base,
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  btnText: { color: colors.bgBase, fontWeight: '600', fontSize: fontSize.base },
});
