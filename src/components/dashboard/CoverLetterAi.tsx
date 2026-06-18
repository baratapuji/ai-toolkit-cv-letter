import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCoverLetter } from '@/hooks/useCoverLetter';
import { generateCoverLetterDocx } from '@/services/letterGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Sparkles, Copy, CheckCircle, Briefcase, Building2, AlignLeft, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { checkAndUnlockAchievements } from '@/services/gameService';

export function CoverLetterAi() {
  const { user } = useAuth();
  const { isGenerating, generatedText, generateLetter, resetLetter } = useCoverLetter(user?.id);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateLetter({ company, role, skills });
  };

  const handleCopy = async () => {
  if (generatedText) {
    navigator.clipboard.writeText(generatedText);
    toast.success('Copied to clipboard!');
    if (user?.id) await checkAndUnlockAchievements(user.id);
  }
};

  const handleDownloadDocx = async () => {
    if (!generatedText) {
      toast.error('Tidak ada surat untuk di-download.');
      return;
    }
    try {
      const blob = await generateCoverLetterDocx(generatedText, company, role);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Cover_Letter_${company || 'Perusahaan'}.docx`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success('Surat berhasil di-download sebagai .docx!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Gagal generate file .docx');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full px-4">
      
      {/* HEADER PIXEL */}
      <div className="space-y-2">
        <h2 className="text-3xl font-pixel text-white tracking-widest flex items-center gap-3">
          <Mail className="text-violet-500 w-8 h-8" />
          <span className="text-white">COVER LETTER</span>
          <span className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">SYNTHESIZER</span>
        </h2>
        <p className="text-zinc-400 font-pixel text-xs tracking-widest uppercase">Generate surat lamaran profesional & download sebagai file Word (.docx).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* KOLOM KIRI: FORM */}
        <div className="game-panel p-8 rounded-3xl relative overflow-hidden group border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
          <h3 className="font-pixel text-xl text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-violet-400" />
            Input Parameters
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <Label className="text-zinc-300 font-pixel text-xs tracking-widest uppercase">Target Role / Posisi</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <Input
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="pl-10 bg-zinc-900/50 border-violet-500/30 text-white placeholder:text-zinc-600 focus-visible:ring-violet-500 h-12 rounded-xl font-pixel text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300 font-pixel text-xs tracking-widest uppercase">Company Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <Input
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. PT Teknologi Indonesia"
                  className="pl-10 bg-zinc-900/50 border-violet-500/30 text-white placeholder:text-zinc-600 focus-visible:ring-violet-500 h-12 rounded-xl font-pixel text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300 font-pixel text-xs tracking-widest uppercase">Key Skills / Highlight (Opsional)</Label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Sebutkan keahlian atau pengalaman utamamu di sini..."
                className="w-full min-h-[120px] bg-zinc-900/50 border border-violet-500/30 text-white placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 p-4 rounded-xl resize-none font-pixel text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full h-14 mt-4 text-md font-pixel tracking-widest uppercase bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 rounded-xl border-none disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2 animate-pulse">
                  <Sparkles className="w-5 h-5 animate-spin" /> SYNTHESIZING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> GENERATE (COST: 1 ENR)
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* KOLOM KANAN: HASIL */}
        <div className="game-panel p-8 rounded-3xl relative flex flex-col border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] h-[550px]">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h3 className="font-pixel text-xl text-white uppercase tracking-widest flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              Output Terminal
            </h3>
            <div className="flex gap-2">
              {generatedText && (
                <>
                  <Button onClick={handleCopy} size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none font-pixel text-xs tracking-widest uppercase">
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                  <Button onClick={handleDownloadDocx} size="sm" variant="secondary" className="bg-blue-500/10 hover:bg-blue-500/20 text-white border-none font-pixel text-xs tracking-widest uppercase">
                    <FileText className="w-4 h-4 mr-1" /> .docx
                  </Button>
                  <Button onClick={resetLetter} size="sm" variant="secondary" className="bg-red-500/10 hover:bg-red-500/20 text-white border-none font-pixel text-xs tracking-widest uppercase">
                    Clear
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 bg-zinc-950/80 border border-zinc-800 rounded-xl p-6 overflow-y-auto relative">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4"></div>
                <p className="text-violet-400 font-pixel text-xs animate-pulse uppercase tracking-widest">Writing neural pathways...</p>
              </div>
            ) : generatedText ? (
              <p className="text-zinc-300 whitespace-pre-wrap font-pixel text-sm leading-relaxed">
                {generatedText}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                <Mail className="w-16 h-16 mb-4 text-zinc-500" />
                <p className="text-zinc-400 font-pixel text-xs uppercase tracking-widest">Awaiting input parameters to generate module...</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}