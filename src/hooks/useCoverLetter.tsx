import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { dashboardService } from '@/services/dashboardService';
import { generateCoverLetter } from '@/services/aiService'; // ✅ IMPORT INI
import { toast } from 'sonner';

export function useCoverLetter(userId: string | undefined) {
  const { addXp, useCredit } = useGameStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  const generateLetter = async (params: { company: string; role: string; skills?: string }) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    const success = useCredit();
    if (!success) {
      toast.error('Not enough energy to run the AI generator!');
      return;
    }

    setIsGenerating(true);
    setGeneratedText(null);

    try {
      // 🔥 PANGGIL AI BENERAN (GEMINI 2.5 FLASH)
      const content = await generateCoverLetter(params);

      // Simpan ke database
      await dashboardService.saveCoverLetter(
        userId,
        params.company,
        params.role,
        content
      );

      setGeneratedText(content);
      addXp(40);
      
      toast.success('Cover Letter Synthesized! +40 XP');
    } catch (error: any) {
      toast.error(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetLetter = () => setGeneratedText(null);

  return {
    isGenerating,
    generatedText,
    generateLetter,
    resetLetter,
  };
}