import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGameStore } from '@/store/useGameStore'; // 👈 TAMBAHKAN INI
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  User, GraduationCap, Building2, Save, Mail, UserCircle, Upload, Loader2,
  Shield, Sparkles, Crown, Zap, Trophy, Flame
} from 'lucide-react';

export function ProfileSettings() {
  const { user } = useAuth();
  // 👇 AMBIL DATA DARI STORE
  const { credits, level, xp, xpToNextLevel, streak } = useGameStore();
  
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    university: '',
    major: '',
  });

  // Load profile data
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email, university, major, avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading profile:', error);
          setForm({
            full_name: '',
            email: user.email || '',
            university: '',
            major: '',
          });
          return;
        }

        if (data) {
          setForm({
            full_name: data.full_name || '',
            email: data.email || user.email || '',
            university: data.university || '',
            major: data.major || '',
          });
          setAvatarUrl(data.avatar_url || null);
        } else {
          setForm({
            full_name: '',
            email: user.email || '',
            university: '',
            major: '',
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Upload avatar
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File terlalu besar! Maksimal 2MB.');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Hanya support JPEG, PNG, atau WEBP.');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success('Avatar updated successfully! 🎉');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: form.full_name,
          email: form.email,
          university: form.university,
          major: form.major,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        });

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(`Failed to update: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Hitung XP progress
  const progressPercent = Math.min((xp / xpToNextLevel) * 100, 100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full px-4">
      
      {/* HEADER GAMIFIKASI */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-violet-500/10 border border-white/5 p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-500/5 rounded-full blur-2xl"></div>
        
        <div className="relative flex items-center gap-4 flex-wrap">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="font-pixel text-2xl text-white tracking-wider">
              PROFILE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">.SYS</span>
            </h2>
            <p className="text-xs text-zinc-400 font-pixel tracking-widest mt-1">
              <span className="text-cyan-400">◆</span> IDENTITY MANAGEMENT
            </p>
          </div>
          
          {/* PLAYER STATS - DINAMIS */}
          <div className="ml-auto flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="font-pixel text-xs text-zinc-400">LV.{level}</span>
            </div>
            <div className="w-px h-5 bg-white/10"></div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-pixel text-xs text-white">{credits}</span>
            </div>
            <div className="w-px h-5 bg-white/10"></div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-pixel text-xs text-zinc-400">{streak}d</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="game-panel p-8 rounded-2xl border border-white/5 shadow-[0_0_40px_rgba(6,182,212,0.05)]">
        
        {/* AVATAR UPLOAD - GAMIFIKASI */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-white/10">
          <div className="relative group">
            {/* Avatar border animasi */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 animate-[spin_4s_linear_infinite] opacity-60 blur-sm"></div>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 animate-[spin_4s_linear_infinite] opacity-30"></div>
            
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-3xl font-pixel text-white overflow-hidden border-2 border-white/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">{form.full_name?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
            
            {/* Level badge - DINAMIS */}
            <div className="absolute -bottom-1 -right-1 bg-violet-500 border-2 border-violet-400 rounded-lg px-2 py-0.5 text-[10px] font-pixel text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]">
              Lv.{level}
            </div>
          </div>
          
          <div className="text-center sm:text-left">
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 hover:border-cyan-500/50 font-pixel text-xs tracking-wider group">
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
                {uploading ? 'UPLOADING...' : 'UPLOAD AVATAR'}
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploading}
              />
            </Label>
            <p className="text-[10px] text-zinc-500 font-pixel mt-2 tracking-widest">
              MAX 2MB • JPG, PNG, WEBP
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-zinc-300 font-pixel text-xs tracking-wider flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-cyan-400" /> 
              FULL NAME
            </Label>
            <div className="relative">
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="[ENTER IDENTITY]"
                className="bg-black/50 border-cyan-500/30 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500 h-12 rounded-xl font-pixel text-sm tracking-wider pl-4"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-pixel">
                {form.full_name.length}/32
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300 font-pixel text-xs tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" /> 
              EMAIL
            </Label>
            <Input
              value={form.email}
              disabled
              className="bg-black/30 border-cyan-500/20 text-zinc-400 cursor-not-allowed h-12 rounded-xl font-pixel text-sm tracking-wider pl-4"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300 font-pixel text-xs tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" /> 
              UNIVERSITY
            </Label>
            <Input
              value={form.university}
              onChange={(e) => setForm({ ...form, university: e.target.value })}
              placeholder="[ACADEMIC INSTITUTION]"
              className="bg-black/50 border-cyan-500/30 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500 h-12 rounded-xl font-pixel text-sm tracking-wider pl-4"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300 font-pixel text-xs tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" /> 
              MAJOR / FIELD
            </Label>
            <Input
              value={form.major}
              onChange={(e) => setForm({ ...form, major: e.target.value })}
              placeholder="[SPECIALIZATION]"
              className="bg-black/50 border-cyan-500/30 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500 h-12 rounded-xl font-pixel text-sm tracking-wider pl-4"
            />
          </div>

          {/* XP PROGRESS BAR - DINAMIS */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[10px] font-pixel text-zinc-400 tracking-widest">
              <span>XP PROGRESS</span>
              <span className="text-white">{xp} / {xpToNextLevel}</span>
            </div>
            <div className="game-bar-container relative overflow-hidden">
              <div className="game-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-sm font-pixel tracking-widest bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all duration-300 rounded-xl border-none group mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                SAVING...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="relative">
                  SAVE PROFILE
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/20 group-hover:bg-white/50 transition-all"></span>
                </span>
                <Sparkles className="w-4 h-4 text-yellow-300 group-hover:animate-pulse" />
              </span>
            )}
          </Button>
        </form>

        {/* STATS BAR - DINAMIS */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap justify-between gap-2 text-[10px] font-pixel text-zinc-500 tracking-widest">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span>ENERGY: <span className="text-white">{credits}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <span>LVL: <span className="text-white">{level}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-3 h-3 text-orange-500" />
            <span>STREAK: <span className="text-white">{streak} DAYS</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">◆</span>
            <span>STATUS: ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}