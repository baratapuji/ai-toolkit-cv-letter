import { useState, useEffect } from 'react';
import { useGameStore } from "@/store/useGameStore";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, Mail, LayoutDashboard, Crosshair, Power, Skull, Settings, 
  Zap, Flame, Trophy, Sparkles, Crown
} from "lucide-react";
import { toast } from "sonner";

export function Sidebar() {
  const { level, xp, xpToNextLevel, activeView, setActiveView, logout, credits, streak } = useGameStore();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{
    full_name: string | null;
    avatar_url: string | null;
  }>({
    full_name: null,
    avatar_url: null,
  });

  // State untuk efek terminate
  const [isTerminating, setIsTerminating] = useState(false);
  const [terminatePhase, setTerminatePhase] = useState(0);
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; speed: number; color: string }[]>([]);

  const progressPercent = Math.min((xp / xpToNextLevel) * 100, 100);

  // Ambil data profil dari Supabase
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || user.email?.split('@')[0] || 'Player',
          avatar_url: data.avatar_url || null,
        });
      } else {
        setProfile({
          full_name: user.email?.split('@')[0] || 'Player',
          avatar_url: null,
        });
      }
    };

    fetchProfile();
  }, [user]);

  // === FUNGSI LOGOUT DENGAN EFEK TERMINATE ===
  const handleDestroyLogout = async () => {
    if (isTerminating) return;
    setIsTerminating(true);
    setTerminatePhase(1);

    // Generate particles
    const newParticles = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 6,
      speed: 0.5 + Math.random() * 2,
      color: ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)]
    }));
    setParticles(newParticles);

    // Phase 1: Glitch
    setTerminatePhase(1);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Phase 2: Crash
    setTerminatePhase(2);
    await new Promise(resolve => setTimeout(resolve, 600));

    // Phase 3: Shutdown
    setTerminatePhase(3);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Eksekusi logout
    try {
      await signOut();
      logout();
      setActiveView('dashboard');
      
      setTerminatePhase(0);
      setIsTerminating(false);
      setParticles([]);
      
      toast.success("Connection severed successfully!");
    } catch (error: any) {
      toast.error(`Failed to terminate: ${error.message}`);
      setIsTerminating(false);
      setTerminatePhase(0);
      setParticles([]);
    }
  };

  const getInitial = () => {
    if (profile.full_name) return profile.full_name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'P';
  };

  const menuItems = [
    { id: 'profile', label: 'PROFILE', icon: Settings, color: 'amber' },
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard, color: 'pink' },
    { id: 'cv-checker', label: 'ATS SCANNER', icon: FileText, color: 'violet' },
    { id: 'cover-letter', label: 'LETTER SYNTH', icon: Mail, color: 'blue' },
    { id: 'achievements', label: 'ACHIEVEMENTS', icon: Trophy, color: 'yellow' },
    { id: 'leaderboard', label: 'LEADERBOARD', icon: Crown, color: 'gold' },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    amber: { bg: 'amber-500/10', text: 'amber-400', border: 'amber-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
    pink: { bg: 'pink-500/10', text: 'pink-400', border: 'pink-500', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]' },
    violet: { bg: 'violet-500/10', text: 'violet-400', border: 'violet-500', glow: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]' },
    blue: { bg: 'blue-500/10', text: 'blue-400', border: 'blue-500', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' },
    yellow: { bg: 'yellow-500/10', text: 'yellow-400', border: 'yellow-500', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' },
    gold: { bg: 'yellow-500/10', text: 'yellow-400', border: 'yellow-500', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' },
  };

  return (
    <>
      {/* ===== OVERLAY TERMINATE (EFEK EPIC) ===== */}
      {isTerminating && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div className="absolute inset-0 bg-black/90" />
          
          {/* Glitch lines */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
                style={{
                  top: `${Math.random() * 100}%`,
                  animation: `glitchLine ${0.1 + Math.random() * 0.2}s linear ${Math.random() * 0.5}s infinite`,
                  opacity: 0.3 + Math.random() * 0.5,
                }}
              />
            ))}
          </div>

          {/* Screen tear */}
          <div 
            className="absolute inset-0 transition-all duration-100"
            style={{
              clipPath: terminatePhase >= 2 ? `polygon(
                0% 0%, 100% 0%, 100% 30%, 60% 30%,
                60% 40%, 80% 40%, 80% 50%, 40% 50%,
                40% 60%, 70% 60%, 70% 70%, 30% 70%,
                30% 80%, 90% 80%, 90% 90%, 0% 90%
              )` : 'none',
              transform: terminatePhase >= 2 ? 'scale(0.98) rotate(-0.5deg)' : 'scale(1)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-violet-500/20 to-cyan-500/20" />
          </div>

          {/* Particles */}
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                animation: `particleExplode ${0.5 + p.speed * 0.5}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.3}s`,
              }}
            />
          ))}

          {/* Teks status */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {terminatePhase === 1 && (
              <div className="text-center animate-pulse">
                <Skull className="w-24 h-24 text-red-500 mx-auto mb-4 animate-pulse" />
                <p className="font-pixel text-3xl text-red-500 tracking-widest">⚠️ SYSTEM CRITICAL</p>
                <p className="font-pixel text-sm text-red-400/70 mt-2 tracking-widest">INITIATING TERMINATION...</p>
              </div>
            )}
            {terminatePhase === 2 && (
              <div className="text-center">
                <p className="font-pixel text-4xl text-white tracking-widest animate-pulse" style={{ animationDuration: '0.1s' }}>
                  💀 SYSTEM CRASH
                </p>
                <p className="font-pixel text-xs text-zinc-400 mt-4 tracking-widest">
                  0x7F: SESSION CORRUPTED
                </p>
                <div className="w-64 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-4 animate-pulse" />
              </div>
            )}
            {terminatePhase === 3 && (
              <div className="text-center">
                <p className="font-pixel text-5xl text-white tracking-widest animate-pulse">⏻</p>
                <p className="font-pixel text-sm text-zinc-500 mt-4 tracking-widest animate-pulse">
                  SHUTTING DOWN...
                </p>
                <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-2" />
              </div>
            )}
          </div>

          {/* Scanline */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.05)_2px,rgba(0,0,0,0.05)_4px)]" />
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,black_100%)] pointer-events-none" />
        </div>
      )}

      {/* ===== SIDEBAR UTAMA ===== */}
      <aside className="w-64 game-panel border-r-0 h-screen hidden md:flex flex-col relative z-20 rounded-none overflow-hidden">
        
        {/* Background aura */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 via-violet-500/5 to-transparent pointer-events-none"></div>
        
        {/* PLAYER HUD */}
        <div className="p-6 bg-gradient-to-b from-pink-500/10 to-transparent relative z-10">
          <div className="flex items-center gap-4 mb-5">
            {/* Avatar dengan border rotating */}
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 animate-[spin_3s_linear_infinite] opacity-70"></div>
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 animate-[spin_3s_linear_infinite] blur-md opacity-40"></div>
              <Avatar className="h-14 w-14 border-2 border-pink-400 rounded-lg transform rotate-3 relative">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-zinc-950 text-pink-400 font-pixel text-xl transform -rotate-3">
                  {getInitial()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-pixel text-sm text-white uppercase tracking-widest leading-tight truncate">
                {profile.full_name || 'Player'}
              </p>
              <p className="text-[10px] text-zinc-400 font-pixel tracking-wider truncate">
                {user?.email || ''}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-pink-400 font-pixel tracking-widest bg-pink-500/10 px-2 py-0.5 border border-pink-500/30">
                  LVL {level} NOVICE
                </span>
                <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* XP BAR */}
          <div className="space-y-1.5 mt-6">
            <div className="flex justify-between text-[10px] font-pixel text-zinc-400 tracking-widest">
              <span>Experience</span>
              <span className="text-white">{xp} <span className="text-zinc-600">/ {xpToNextLevel}</span></span>
            </div>
            <div className="game-bar-container relative overflow-hidden">
              <div className="game-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/5 hover:border-yellow-500/30 transition-all hover:scale-105">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
              <span className="text-sm font-pixel text-white">{credits}</span>
              <span className="text-[10px] text-zinc-500 font-pixel">Energy</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/5 hover:border-orange-500/30 transition-all hover:scale-105">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-sm font-pixel text-white">{streak}</span>
              <span className="text-[10px] text-zinc-500 font-pixel">Days</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 flex-1 space-y-2 mt-4 overflow-y-auto relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 mb-3 text-xs font-pixel text-violet-400 tracking-widest border-b border-violet-500/20 pb-2">
            <Crosshair className="w-4 h-4 animate-pulse" />
            <span>COMMAND CENTER</span>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const colors = colorMap[item.color];
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-xs font-pixel tracking-widest
                  transition-all duration-300 group relative rounded-lg
                  ${isActive 
                    ? `bg-${colors.bg} text-white ${colors.glow} border-l-2 ${colors.border}` 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5 hover:translate-x-1'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-transparent via-current to-transparent rounded-full animate-pulse" 
                       style={{ color: `var(--${item.color}-400)` }} />
                )}
                
                <Icon className={`
                  w-5 h-5 transition-all duration-300 relative z-10
                  ${isActive ? `text-${colors.text}` : 'group-hover:text-white'}
                  ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                `} />
                
                <span className="relative z-10">{item.label}</span>
                
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-current/10 to-transparent opacity-50"
                       style={{ color: `var(--${item.color}-400)` }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-4 mt-auto border-t border-red-500/20 bg-red-950/10 relative z-10">
          <button 
            onClick={handleDestroyLogout} 
            disabled={isTerminating}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-xs font-pixel text-red-500 tracking-widest uppercase hover:text-white hover:bg-red-600 transition-all duration-300 border border-red-500/30 hover:border-red-500 transform skew-x-[-10deg] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/30 to-red-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="transform skew-x-[10deg] flex items-center gap-2 relative z-10">
              {isTerminating ? (
                <>
                  <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  TERMINATING...
                </>
              ) : (
                <>
                  <Power className="w-4 h-4 group-hover:animate-ping transition-all" /> 
                  TERMINATE LINK
                </>
              )}
            </span>
          </button>
        </div>

      </aside>
    </>
  );
}