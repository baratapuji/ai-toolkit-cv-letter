// hooks/useAchievements.ts
import { useState, useEffect } from 'react';
import { achievementService } from '@/services/achievementService';
import type { Achievement } from '@/types/achievement';

export function useAchievements(userId: string | undefined) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [all, unlocked] = await Promise.all([
          achievementService.getAllAchievements(),
          achievementService.getUserAchievements(userId),
        ]);
        setAchievements(all);
        setUnlockedIds(unlocked);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const isUnlocked = (achievementId: string) => unlockedIds.includes(achievementId);

  return { achievements, unlockedIds, isUnlocked, loading, error };
}