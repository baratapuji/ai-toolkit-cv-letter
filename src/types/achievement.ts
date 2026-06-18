// types/achievement.ts
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  credits_reward: number;
  condition_type: 'scan_cv' | 'generate_letter' | 'level_up' | 'streak';
  condition_value: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface LeaderboardEntry {
  id: string;
  full_name: string;
  level: number;
  xp: number;
  avatar_url: string | null;
  achievement_count: number;
}