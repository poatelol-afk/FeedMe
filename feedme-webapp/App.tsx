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

// ── Duolingo Style Tab Bar Icons ─────────────────────────
const TAB_ICONS: Record<string, string> = {
  Home: '🏠',
  Log: '📝',
  Workout: '💪',
  Shop: '🛒',
  Profile: '👤',
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ scale: focused ? 1.15 : 1.0 }],
    }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.65 }}>
        {TAB_ICONS[name]}
      </Text>
    </View>
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
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e5e5',
          borderTopWidth: 2,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 64 + insets.bottom,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: '#999999',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: 4,
          letterSpacing: 0.3,
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen}    options={{ title: 'หน้าหลัก' }} />
      <Tab.Screen name="Log"     component={LogScreen}     options={{ title: 'บันทึกอาหาร' }} />
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
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
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
      <StatusBar style="dark" />
      <AuthProvider>
        <NavigationContainer>
          <RootNav />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
