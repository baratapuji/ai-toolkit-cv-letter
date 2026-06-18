import { useAuth } from '@/hooks/useAuth';
import { useAchievements } from '@/hooks/useAchievements';
import { CheckCircle, Lock, Sparkles } from 'lucide-react';

export function Achievements() {
  const { user } = useAuth();
  const { achievements, isUnlocked, loading, error } = useAchievements(user?.id);

  if (loading) return <div className="game-panel p-6 text-zinc-500 font-pixel text-xs animate-pulse">LOADING...</div>;
  if (error) return <div className="game-panel p-6 text-red-400 font-pixel text-xs">{error}</div>;

  return (
    <div className="game-panel p-6 border border-white/10 rounded-2xl">
      <h3 className="font-pixel text-xl text-white tracking-widest flex items-center gap-3 mb-6">
        <Sparkles className="text-yellow-400 w-6 h-6" />
        ACHIEVEMENTS
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {achievements.map((ach) => {
          const unlocked = isUnlocked(ach.id);
          return (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all ${
                unlocked
                  ? 'bg-violet-500/10 border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                  : 'bg-white/5 border-white/5 opacity-50 grayscale'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{ach.icon || '🏆'}</div>
                <div className="flex-1">
                  <p className="font-pixel text-sm text-white tracking-wider">{ach.name}</p>
                  <p className="text-[10px] text-zinc-400 font-pixel">{ach.description}</p>
                </div>
                {unlocked ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Lock className="w-5 h-5 text-zinc-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}