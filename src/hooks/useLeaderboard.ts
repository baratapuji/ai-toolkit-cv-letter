// hooks/useLeaderboard.ts
import { useState, useEffect } from 'react';
import { leaderboardService } from '@/services/leaderboardService';
import type { LeaderboardEntry } from '@/types/achievement';

export function useLeaderboard(limit: number = 10) {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await leaderboardService.getTopPlayers(limit);
        setPlayers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { players, loading, error };
}