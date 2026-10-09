// ═══════════════════════════════════════════════════════
//  Supabase Client สำหรับ React Native
//  ใช้ AsyncStorage แทน Cookie (เหมาะกับ Mobile)
// ═══════════════════════════════════════════════════════
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://ptvjyexxxsfwjszdzthw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_g3gafcsVYuLMYmR0TOuKMQ_oHjefZrr';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
