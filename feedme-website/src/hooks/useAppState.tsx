'use client';

import {
  createContext, useContext, useCallback,
  useState, useEffect, ReactNode,
} from 'react';
import { AppState, DiaryEntry, SupplementItem, UserProfile, WorkoutEntry } from '@/types';
import * as db from '@/lib/db';

interface AppContextValue extends AppState {
  loading: boolean;
  saveProfile: (profile: UserProfile) => Promise<void>;
  addFood: (entry: Omit<DiaryEntry, 'id' | 'timestamp'>) => Promise<void>;
  deleteFood: (id: string) => Promise<void>;
  addWorkout: (entry: Omit<WorkoutEntry, 'id' | 'timestamp'>) => Promise<void>;
  purchaseItem: (itemId: string, itemName: string, coinPrice: number) => Promise<boolean>;
  addWater: (amountMl: number) => Promise<void>;
  deleteWater: (id: string) => Promise<void>;
  toggleSupplement: (id: string) => Promise<void>;
  addCustomSupplement: (name: string, dose: string, timeOfDay: SupplementItem['timeOfDay'], emoji?: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const defaultState: AppState = {
  profile: null,
  goal: null,
  diary: [],
  workouts: [],
  coins: 0,
  streak: { current: 0, longest: 0, lastActiveDate: '' },
  quests: [],
  purchases: [],
  calorieTrend: [],
  waterGoal: 2500,
  waterToday: 0,
  waterEntries: [],
  supplements: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const fullState = await db.getFullState();
      setState(fullState);
    } catch (err) {
      console.error('[AppState] refresh error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const saveProfile = useCallback(async (profile: UserProfile) => {
    const goal = await db.saveProfile(profile);
    setState(prev => ({ ...prev, profile, goal }));
    await refresh();
  }, [refresh]);

  const addFood = useCallback(async (entry: Omit<DiaryEntry, 'id' | 'timestamp'>) => {
    await db.addFoodLog(entry);
    await db.updateQuestProgress('food', 1);
    await refresh();
  }, [refresh]);

  const deleteFood = useCallback(async (id: string) => {
    await db.deleteFoodLog(id);
    await refresh();
  }, [refresh]);

  const addWorkout = useCallback(async (entry: Omit<WorkoutEntry, 'id' | 'timestamp'>) => {
    await db.addWorkout(entry);
    await refresh();
  }, [refresh]);

  const purchaseItem = useCallback(async (
    itemId: string, itemName: string, coinPrice: number,
  ): Promise<boolean> => {
    const result = await db.addPurchase({ itemId, itemName, coinSpent: coinPrice });
    if (result) {
      await db.updateQuestProgress('shop', 1);
      await refresh();
      return true;
    }
    return false;
  }, [refresh]);

  const addWater = useCallback(async (amountMl: number) => {
    await db.addWater(amountMl);
    await refresh();
  }, [refresh]);

  const deleteWater = useCallback(async (id: string) => {
    await db.deleteWater(id);
    await refresh();
  }, [refresh]);

  const toggleSupplement = useCallback(async (id: string) => {
    await db.toggleSupplement(id);
    await refresh();
  }, [refresh]);

  const addCustomSupplement = useCallback(async (
    name: string, dose: string, timeOfDay: SupplementItem['timeOfDay'], emoji?: string
  ) => {
    await db.addCustomSupplement(name, dose, timeOfDay, emoji);
    await refresh();
  }, [refresh]);

  return (
    <AppContext.Provider value={{
      ...state,
      loading,
      saveProfile,
      addFood,
      deleteFood,
      addWorkout,
      purchaseItem,
      addWater,
      deleteWater,
      toggleSupplement,
      addCustomSupplement,
      refresh,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
