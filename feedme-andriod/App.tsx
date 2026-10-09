import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { colors } from './src/lib/theme';

import AuthScreen     from './src/screens/AuthScreen';
import HomeScreen     from './src/screens/HomeScreen';
import LogScreen      from './src/screens/LogScreen';
import WorkoutScreen  from './src/screens/WorkoutScreen';
import ShopScreen     from './src/screens/ShopScreen';
import ProfileScreen  from './src/screens/ProfileScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ── ไอคอน Tab bar ──────────────────────────────────────
const TAB_ICONS: Record<string, string> = {
  Home: '🏠', Log: '📝', Workout: '💪', Shop: '🛒', Profile: '👤',
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>
      {TAB_ICONS[name]}
    </Text>
  );
}

// ── Main tabs (แสดงหลัง login) ─────────────────────────
function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgCard,
          borderTopColor: colors.borderSoft,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 6),
          height: 64 + insets.bottom,
        },
        tabBarActiveTintColor:   colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, marginBottom: 6 },
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen}    options={{ title: 'หน้าหลัก' }} />
      <Tab.Screen name="Log"     component={LogScreen}     options={{ title: 'บันทึก' }} />
      <Tab.Screen name="Workout" component={WorkoutScreen} options={{ title: 'ออกกำลัง' }} />
      <Tab.Screen name="Shop"    component={ShopScreen}    options={{ title: 'ร้านค้า' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'โปรไฟล์' }} />
    </Tab.Navigator>
  );
}

// ── Root navigator — เช็ค auth state ──────────────────
function RootNav() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgBase, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session
        ? <Stack.Screen name="Main" component={MainTabs} />
        : <Stack.Screen name="Auth" component={AuthScreen} />
      }
    </Stack.Navigator>
  );
}

// ── App entry point ────────────────────────────────────
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <NavigationContainer>
          <RootNav />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
