import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Trophy, Crown, Medal, Star } from 'lucide-react';

export function Leaderboard() {
  const { players, loading, error } = useLeaderboard(10);

  return (
    <div className="game-panel p-6 border border-white/10 rounded-2xl">
      <h3 className="font-pixel text-xl text-white tracking-widest flex items-center gap-3 mb-6">
        <Trophy className="text-yellow-500 w-6 h-6" />
        LEADERBOARD
      </h3>

      {loading && <p className="text-zinc-500 font-pixel text-xs animate-pulse">LOADING...</p>}
      {error && <p className="text-red-400 font-pixel text-xs">{error}</p>}
      {!loading && !error && (
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center gap-3 px-2 pb-2 border-b border-white/5 text-[10px] text-zinc-500 font-pixel tracking-widest uppercase">
            <div className="w-8 text-center">#</div>
            <div className="flex-1">Player</div>
            <div className="w-12 text-center">LVL</div>
            <div className="w-16 text-center">XP</div>
            <div className="w-12 text-center">🏅</div>
            <div className="w-16 text-center text-yellow-400">SCORE</div>
          </div>

          {players.map((player, idx) => {
            // Hitung Total Score = XP + (achievement_count * 10)
            const totalScore = player.xp + (player.achievement_count || 0) * 10;

            const rankIcon = idx === 0 ? <Crown className="w-5 h-5 text-yellow-500" /> :
                             idx === 1 ? <Medal className="w-5 h-5 text-gray-400" /> :
                             idx === 2 ? <Medal className="w-5 h-5 text-amber-600" /> :
                             <span className="w-5 h-5 text-center text-zinc-500 font-pixel text-xs">{idx+1}</span>;
            
            return (
              <div 
                key={player.id} 
                className={`flex items-center gap-3 p-2 rounded-lg transition border ${
                  idx === 0 ? 'bg-yellow-500/10 border-yellow-500/30' :
                  idx === 1 ? 'bg-gray-500/10 border-gray-500/30' :
                  idx === 2 ? 'bg-amber-600/10 border-amber-600/30' :
                  'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="w-8 flex justify-center">{rankIcon}</div>
                
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  {player.avatar_url ? (
                    <img src={player.avatar_url} className="w-8 h-8 rounded-full flex-shrink-0" alt="avatar" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center font-pixel text-sm text-violet-400 flex-shrink-0">
                      {player.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="font-pixel text-sm text-white tracking-wider truncate">
                    {player.full_name || 'Player'}
                  </span>
                </div>
                
                <div className="w-12 text-center font-pixel text-xs text-zinc-400">
                  Lv.{player.level}
                </div>
                
                <div className="w-16 text-center font-pixel text-xs text-yellow-400">
                  {player.xp}
                </div>
                
                <div className="w-12 text-center font-pixel text-xs text-violet-400">
                  {player.achievement_count || 0}
                </div>
                
                <div className="w-16 text-center font-pixel text-sm text-cyan-400 font-bold">
                  {totalScore.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-[10px] text-zinc-500 font-pixel tracking-widest">
        <span>🏆 TOP 10 PLAYERS</span>
        <span>SCORE = XP + (ACHIEVEMENTS × 10)</span>
      </div>
    </div>
  );
}