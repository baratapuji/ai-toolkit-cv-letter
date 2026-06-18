import { useGameStore } from '@/store/useGameStore';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Zap, History, Star, CheckSquare, ArrowRight, ShieldAlert } from 'lucide-react';

export function MainDashboard() {
  const { level, xp, xpToNextLevel, credits, streak, setActiveView } = useGameStore();
  const { user } = useAuth();
  const { logs, loading, error } = useDashboard(user?.id);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10 px-4">
      
      {/* HEADER PIXEL */}
      <div className="game-panel p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative border border-pink-500/20">
        <div className="absolute top-2 left-2 flex gap-2">
          <span className="text-[10px] text-pink-500/50 font-pixel tracking-widest">SYS.VER.4.2</span>
        </div>
        
        <div className="relative z-10 space-y-3 text-center md:text-left mt-2">
          <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-400 font-pixel text-xs tracking-widest uppercase mb-2">
            <ShieldAlert className="w-5 h-5 animate-pulse" /> Secure Connection Established
          </div>
          <h2 className="text-4xl md:text-5xl font-pixel text-white uppercase tracking-wider">
            WELCOME, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PLAYER</span>
          </h2>
          <p className="text-zinc-400 font-pixel text-sm uppercase tracking-wide">
            Next Rank up in <span className="text-pink-400 font-bold">{xpToNextLevel - xp} XP</span>
          </p>
        </div>

        <div className="relative z-10 bg-black/40 border border-cyan-500/30 px-8 py-5 flex items-center gap-4 transform skew-x-[-10deg]">
          <div className="transform skew-x-[10deg] text-center">
            <p className="text-xs text-cyan-400 font-pixel tracking-widest uppercase mb-1">Current Rank</p>
            <div className="flex items-center gap-2">
              <Trophy className="w-7 h-7 text-yellow-500" />
              <span className="text-2xl font-pixel text-white uppercase tracking-wider">Novice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* STATS ROW - PIXEL STYLE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="game-panel p-6 border-t-pink-500 relative overflow-hidden border border-pink-500/20">
              <Star className="absolute -right-4 -bottom-4 w-32 h-32 text-pink-500/5 rotate-12" />
              <div className="relative z-10 flex justify-between items-start">
                <Star className="w-8 h-8 text-pink-500" />
                <span className="text-4xl font-pixel text-white">{xp}</span>
              </div>
              <p className="text-sm text-zinc-400 font-pixel tracking-widest uppercase mt-4">Total XP</p>
            </div>
            
            <div className="game-panel p-6 border-t-violet-500 border border-violet-500/20">
              <div className="flex justify-between items-start">
                <Zap className="w-8 h-8 text-violet-500" />
                <span className="text-4xl font-pixel text-white">{credits}</span>
              </div>
              <p className="text-sm text-zinc-400 font-pixel tracking-widest uppercase mt-4">Energy Units</p>
            </div>
            
            <div className="game-panel p-6 border-t-orange-500 border border-orange-500/20">
              <div className="flex justify-between items-start">
                <Target className="w-8 h-8 text-orange-500" />
                <span className="text-4xl font-pixel text-white">{streak}</span>
              </div>
              <p className="text-sm text-zinc-400 font-pixel tracking-widest uppercase mt-4">Active Streak</p>
            </div>
          </div>

          {/* DAILY QUESTS - PIXEL STYLE */}
          <div className="game-panel p-8 border border-white/10">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <h3 className="font-pixel text-xl text-white uppercase tracking-widest flex items-center gap-3">
                <CheckSquare className="w-6 h-6 text-pink-500" /> Daily Objectives
              </h3>
              <span className="text-xs font-pixel text-pink-400 bg-pink-500/10 px-3 py-1.5 border border-pink-500/20 uppercase tracking-widest">
                Reset: 14:22:05
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="bg-black/40 border border-white/10 p-5 hover:border-pink-500/50 transition-colors flex items-center justify-between transform hover:translate-x-2 duration-300">
                <div>
                  <h4 className="text-lg font-pixel text-white uppercase tracking-wider mb-1">ATS Protocol Scan</h4>
                  <p className="text-sm text-zinc-400 font-pixel">Execute the Resume Scanner module.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-pixel text-pink-500 tracking-wider">+50 XP</p>
                    <p className="text-sm font-pixel text-violet-400 tracking-wider">+1 ENR</p>
                  </div>
                  <Button onClick={() => setActiveView('cv-checker')} className="bg-pink-600 hover:bg-pink-500 text-white font-pixel text-xs tracking-widest uppercase rounded-none transform skew-x-[-10deg] px-6 py-3">
                    <span className="transform skew-x-[10deg] flex items-center">Start <ArrowRight className="w-4 h-4 ml-2" /></span>
                  </Button>
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 p-5 hover:border-violet-500/50 transition-colors flex items-center justify-between transform hover:translate-x-2 duration-300">
                <div>
                  <h4 className="text-lg font-pixel text-white uppercase tracking-wider mb-1">Synthesize Letter</h4>
                  <p className="text-sm text-zinc-400 font-pixel">Generate 1 AI Cover Letter.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-pixel text-pink-500 tracking-wider">+40 XP</p>
                  </div>
                  <Button onClick={() => setActiveView('cover-letter')} className="bg-violet-600 hover:bg-violet-500 text-white font-pixel text-xs tracking-widest uppercase rounded-none transform skew-x-[-10deg] px-6 py-3">
                    <span className="transform skew-x-[10deg] flex items-center">Start <ArrowRight className="w-4 h-4 ml-2" /></span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION LOG - PIXEL STYLE */}
        <div className="game-panel p-8 h-full flex flex-col border-t-blue-500 border border-blue-500/20">
          <h3 className="font-pixel text-xl text-white uppercase tracking-widest flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <History className="w-6 h-6 text-blue-500" /> Action Log
          </h3>
          
          <div className="flex-1 space-y-6 relative pl-2">
            <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-zinc-800 to-transparent"></div>
            
            {loading ? (
              <p className="text-zinc-500 font-pixel text-xs animate-pulse">Syncing with server...</p>
            ) : error ? (
              <p className="text-red-400 font-pixel text-xs">⚠️ {error}</p>
            ) : logs.length === 0 ? (
              <p className="text-zinc-500 font-pixel text-xs">Belum ada aktivitas. Mulai scan CV atau buat surat lamaran!</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className={`absolute left-0 top-1.5 w-3 h-3 transform rotate-45 ${log.type === 'ATS' ? 'bg-zinc-600' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'}`}></div>
                  <p className="text-md font-pixel text-white uppercase tracking-wide">
                    {log.type === 'ATS' ? 'ATS Scan Complete' : 'Letter Synthesized'}
                  </p>
                  <p className="text-sm text-zinc-400 font-pixel">
                    {log.type === 'ATS' ? `Score: ${log.score}%` : `Target: ${log.company_name}`}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 font-pixel">
                    {new Date(log.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}