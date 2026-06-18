import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useGameStore } from '@/store/useGameStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Zap, Package, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface TopUpPackage {
  id: string;
  credits: number;
  price: number;
  label: string;
}

const packages: TopUpPackage[] = [
  { id: 'starter', credits: 5, price: 10000, label: 'Starter' },
  { id: 'pro', credits: 15, price: 25000, label: 'Pro' },
  { id: 'unlimited', credits: 30, price: 45000, label: 'Unlimited' },
];

export function TopUpModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { user } = useAuth();
  const { credits, setCredits } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);

  const handleTopUp = async (pkg: TopUpPackage) => {
    if (!user) {
      toast.error('Login dulu!');
      return;
    }

    setLoading(true);
    setSelectedPackage(pkg);

    try {
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: pkg.credits,
          price: pkg.price,
          status: 'pending',
        })
        .select()
        .single();

      if (txError) throw new Error(txError.message);

      await new Promise(resolve => setTimeout(resolve, 1500));

      const { error: updateError } = await supabase
        .from('transactions')
        .update({ status: 'success' })
        .eq('id', transaction.id);

      if (updateError) throw new Error(updateError.message);

      const newCredits = (credits || 0) + pkg.credits;
      setCredits(newCredits);

      toast.success(`+${pkg.credits} Energy berhasil ditambahkan! 🎉`);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Top-up gagal: ${error.message}`);
    } finally {
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-2 border-violet-500/30 text-white max-w-md shadow-[0_0_40px_rgba(139,92,246,0.2)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pixel text-white tracking-widest flex items-center gap-3">
            <Zap className="text-yellow-400 fill-yellow-400 w-7 h-7" />
            <span className="bg-gradient-to-r from-yellow-400 to-violet-400 bg-clip-text text-transparent">TOP-UP</span>
            <span className="text-white">ENERGY</span>
          </DialogTitle>
        </DialogHeader>

        <p className="text-zinc-400 font-pixel text-xs tracking-widest uppercase mb-4">
          Pilih paket energi di bawah ini:
        </p>

        <div className="space-y-3">
          {packages.map((pkg) => {
            const isSelected = selectedPackage?.id === pkg.id && loading;
            return (
              <button
                key={pkg.id}
                onClick={() => handleTopUp(pkg)}
                disabled={loading}
                className={`w-full flex items-center justify-between p-4 transition-all duration-300 rounded-xl border-2 ${
                  isSelected
                    ? 'bg-violet-500/20 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-violet-500/50'
                } disabled:opacity-50 group`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-violet-500/30' : 'bg-violet-500/20'} group-hover:bg-violet-500/30 transition`}>
                    <Package className={`w-5 h-5 ${isSelected ? 'text-violet-300' : 'text-violet-400'}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-pixel text-sm text-white uppercase tracking-widest">{pkg.label}</p>
                    <p className="text-xs text-zinc-400 font-pixel">{pkg.credits} Energy</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className={`font-pixel text-md ${isSelected ? 'text-violet-300' : 'text-violet-400'}`}>
                    Rp {pkg.price.toLocaleString()}
                  </span>
                  {isSelected && <Loader2 className="w-4 h-4 animate-spin text-violet-400" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          <p className="text-xs text-zinc-500 font-pixel tracking-widest uppercase">
            💳 Pembayaran simulasi — otomatis berhasil
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}