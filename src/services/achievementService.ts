import { supabase } from '@/lib/supabase';
import type { Achievement } from '@/types/achievement';

export const achievementService = {
  async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('xp_reward', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getUserAchievements(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
    return data?.map(u => u.achievement_id) || [];
  },

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    const { error } = await supabase
      .from('user_achievements')
      .insert({ user_id: userId, achievement_id: achievementId });
    if (error) throw new Error(error.message);
  },

  async checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
    const [allAchievements, userAchievements, userStats, scanCount, letterCount] = await Promise.all([
      this.getAllAchievements(),
      this.getUserAchievements(userId),
      supabase.from('profiles').select('level, streak, credits').eq('id', userId).single(),
      supabase.from('cv_scans').select('*', { count: 'exact' }).eq('user_id', userId),
      supabase.from('cover_letters').select('*', { count: 'exact' }).eq('user_id', userId),
    ]);

    const unlocked: Achievement[] = [];

    for (const ach of allAchievements) {
      if (userAchievements.includes(ach.id)) continue;

      let conditionMet = false;
      switch (ach.condition_type) {
        case 'scan_cv':
          conditionMet = (scanCount.count || 0) >= ach.condition_value;
          break;
        case 'generate_letter':
          conditionMet = (letterCount.count || 0) >= ach.condition_value;
          break;
        case 'level_up':
          conditionMet = (userStats.data?.level || 0) >= ach.condition_value;
          break;
        case 'streak':
          conditionMet = (userStats.data?.streak || 0) >= ach.condition_value;
          break;
      }

      if (conditionMet) {
        await this.unlockAchievement(userId, ach.id);
        if (ach.xp_reward > 0 || ach.credits_reward > 0) {
          await supabase.rpc('add_xp_and_credits', {
            user_id: userId,
            xp_amount: ach.xp_reward,
            credits_amount: ach.credits_reward,
          });
        }
        unlocked.push(ach);
      }
    }

    return unlocked;
  },
};