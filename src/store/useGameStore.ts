import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

interface GameState {
  // Auth
  isAuthenticated: boolean;
  activeView: string;
  userId: string | null;
  
  // Game stats
  level: number;
  xp: number;
  totalXp: number; // 👈 TAMBAHKAN TOTAL XP
  xpToNextLevel: number;
  credits: number;
  streak: number;
  lastEnergyRecharge: number;
  
  // Actions
  login: () => void;
  logout: () => void;
  setActiveView: (view: string) => void;
  setUser: (userId: string | null) => void;
  
  addXp: (amount: number) => void;
  useCredit: () => boolean;
  rechargeEnergy: () => void;
  setCredits: (amount: number) => void;
  
  // Sync ke database
  syncToDB: () => Promise<void>;
  loadFromDB: (userId: string) => Promise<void>;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // ===== STATE =====
      isAuthenticated: false,
      activeView: 'dashboard',
      userId: null,
      
      level: 1,
      xp: 0,
      totalXp: 0, // 👈 TOTAL XP
      xpToNextLevel: 100,
      credits: 5,
      streak: 1,
      lastEnergyRecharge: Date.now(),

      // ===== AUTH ACTIONS =====
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false, userId: null }),
      setActiveView: (view) => set({ activeView: view }),
      setUser: (userId) => set({ userId }),

      // ===== GAME ACTIONS =====
      addXp: (amount) => {
        const state = get();
        const newXp = state.xp + amount;
        const newTotalXp = state.totalXp + amount; // 👈 TOTAL XP TERUS NAMBAH
        let updates: Partial<GameState> = { xp: newXp, totalXp: newTotalXp };
        
        if (newXp >= state.xpToNextLevel) {
          updates = {
            level: state.level + 1,
            xp: newXp - state.xpToNextLevel,
            totalXp: newTotalXp,
            xpToNextLevel: Math.floor(state.xpToNextLevel * 1.5),
            credits: state.credits + 2,
          };
        }
        
        set(updates);
        
        // Sync ke DB kalo user login
        const { userId } = get();
        if (userId) {
          get().syncToDB().catch(console.error);
        }
      },

      useCredit: () => {
        const state = get();
        if (state.credits > 0) {
          set({ credits: state.credits - 1 });
          if (state.userId) {
            get().syncToDB().catch(console.error);
          }
          return true;
        }
        return false;
      },

      rechargeEnergy: () => {
        const { credits, lastEnergyRecharge } = get();
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (now - lastEnergyRecharge >= oneDay) {
          const newCredits = Math.min(credits + 5, 5);
          set({ credits: newCredits, lastEnergyRecharge: now });
          
          const { userId } = get();
          if (userId) {
            get().syncToDB().catch(console.error);
          }
        }
      },

      setCredits: (amount) => {
        set({ credits: amount });
        const { userId } = get();
        if (userId) {
          get().syncToDB().catch(console.error);
        }
      },

      // ===== SYNC FUNCTIONS =====
      syncToDB: async () => {
        const state = get();
        if (!state.userId) return;
        
        const { level, xp, totalXp, xpToNextLevel, credits, streak } = state;
        await supabase
          .from('profiles')
          .update({
            level,
            xp,
            total_xp: totalXp, // 👈 SYNC TOTAL XP KE DATABASE
            xp_to_next_level: xpToNextLevel,
            credits,
            streak,
            updated_at: new Date().toISOString()
          })
          .eq('id', state.userId);
      },

      loadFromDB: async (userId: string) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('level, xp, total_xp, xp_to_next_level, credits, streak') // 👈 AMBIL TOTAL_XP
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Failed to load game data:', error);
          return;
        }

        if (data) {
          set({
            level: data.level || 1,
            xp: data.xp || 0,
            totalXp: data.total_xp || data.xp || 0, // 👈 PAKE TOTAL_XP
            xpToNextLevel: data.xp_to_next_level || 100,
            credits: data.credits || 5,
            streak: data.streak || 1,
          });
        }
      },
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        level: state.level,
        xp: state.xp,
        totalXp: state.totalXp, // 👈 SIMPAN TOTAL XP JUGA
        xpToNextLevel: state.xpToNextLevel,
        credits: state.credits,
        streak: state.streak,
        lastEnergyRecharge: state.lastEnergyRecharge,
        activeView: state.activeView,
        userId: state.userId,
      }),
    }
  )
);