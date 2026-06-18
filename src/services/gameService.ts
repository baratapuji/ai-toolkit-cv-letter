// services/gameService.ts
import { achievementService } from './achievementService';
import { toast } from 'sonner';

export async function checkAndUnlockAchievements(userId: string) {
  try {
    const unlocked = await achievementService.checkAndUnlockAchievements(userId);
    for (const ach of unlocked) {
      toast.success(`🏆 Achievement Unlocked: ${ach.name}! +${ach.xp_reward} XP`);
    }
    return unlocked;
  } catch (error: any) {
    console.error('Failed to check achievements:', error);
    return [];
  }
}

// Re-export services
export { achievementService } from './achievementService';
export { leaderboardService } from './leaderboardService';