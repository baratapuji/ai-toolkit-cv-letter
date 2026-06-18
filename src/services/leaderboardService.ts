import { supabase } from '@/lib/supabase';
import type { LeaderboardEntry } from '@/types/achievement';

export const leaderboardService = {
  async getTopPlayers(limit: number = 10): Promise<LeaderboardEntry[]> {
    // 🔥 GANTI select 'xp' jadi 'total_xp', dan order by total_xp
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, level, total_xp, avatar_url')
      .order('total_xp', { ascending: false }) // urutkan dari total XP terbesar
      .limit(limit);

    if (error) throw new Error(error.message);

    const withCounts = await Promise.all(
      (data || []).map(async (user) => {
        const { count } = await supabase
          .from('user_achievements')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);
        
        // 🔥 Map total_xp ke field xp biar komponen gak perlu diubah
        return {
          id: user.id,
          full_name: user.full_name,
          level: user.level,
          xp: user.total_xp, // pake total_xp
          avatar_url: user.avatar_url,
          achievement_count: count || 0,
        };
      })
    );

    return withCounts;
  },

  async getPlayerRank(userId: string): Promise<number> {
    // 🔥 Pake total_xp juga buat ranking
    const { data, error } = await supabase
      .from('profiles')
      .select('id, total_xp')
      .order('total_xp', { ascending: false });

    if (error) throw new Error(error.message);
    const rank = data.findIndex(p => p.id === userId) + 1;
    return rank > 0 ? rank : data.length + 1;
  },
};