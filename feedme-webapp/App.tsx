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

const TAB_ICONS: Record<string, string> = {
  Home: '⚡',
  Log: '🍱',
  Workout: '🏋️',
  Shop: '🎁',
  Profile: '👤',
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: focused ? colors.primarySoft : 'transparent',
    }}>
      <Text style={{ fontSize: 19, opacity: focused ? 1 : 0.65 }}>
        {TAB_ICONS[name]}
      </Text>
    </View>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 64 + insets.bottom,
        },
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginBottom: 4,
          letterSpacing: 0.2,
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen}    options={{ title: 'Today' }} />
      <Tab.Screen name="Log"     component={LogScreen}     options={{ title: 'Food AI' }} />
      <Tab.Screen name="Workout" component={WorkoutScreen} options={{ title: 'Train' }} />
      <Tab.Screen name="Shop"    component={ShopScreen}    options={{ title: 'Rewards' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Body' }} />
    </Tab.Navigator>
  );
}

function RootNav() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
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
