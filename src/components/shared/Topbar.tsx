import { useState } from 'react';
import { useGameStore } from "@/store/useGameStore";
import { Badge } from "@/components/ui/badge";
import { TopUpModal } from '@/components/dashboard/TopUpModal';
import { Flame, Zap, Trophy, Plus } from "lucide-react";

export function Topbar() {
  const { credits, streak, level, xp, xpToNextLevel } = useGameStore();
  const [topUpOpen, setTopUpOpen] = useState(false);

  return (
    <header className="h-16 game-panel border-b-0 flex items-center justify-between px-6 sticky top-0 z-20 rounded-none">
      {/* Logo */}
      <h2 className="font-pixel text-lg text-white tracking-widest italic">
        AI<span className="text-pink-500">TOOLKIT</span>
      </h2>
      
      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="flex items-center gap-1.5 font-pixel text-orange-500 text-sm tracking-widest">
          <Flame className="w-5 h-5 fill-orange-500 animate-pulse" />
          <span>{streak} DAYS</span>
        </div>

        {/* Level & XP */}
        <div className="hidden sm:flex items-center gap-2 font-pixel text-xs text-zinc-400 tracking-wider">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-white">LV.{level}</span>
          <span className="text-zinc-600">|</span>
          <span>{xp} / {xpToNextLevel} XP</span>
        </div>

        {/* Energy dengan tombol top-up */}
        <Badge 
          variant="secondary" 
          className="px-3 py-1.5 text-sm font-pixel tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1.5 rounded-lg"
        >
          <Zap className="w-4 h-4 fill-violet-400" /> 
          {credits} ENERGY
          <button 
            onClick={() => setTopUpOpen(true)} 
            className="ml-0.5 p-0.5 rounded-full bg-violet-500/20 hover:bg-violet-500/40 transition-all hover:scale-110"
          >
            <Plus className="w-3 h-3 text-violet-400" />
          </button>
        </Badge>
      </div>

      <TopUpModal open={topUpOpen} onOpenChange={setTopUpOpen} />
    </header>
  );
}