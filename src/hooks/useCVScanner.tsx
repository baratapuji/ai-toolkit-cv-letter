// hooks/useCVScanner.tsx
import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { supabase } from '@/lib/supabase';
import { dashboardService } from '@/services/dashboardService';
import { scanResume, extractTextFromFile } from '@/services/aiService';
import { toast } from 'sonner';

export function useCVScanner(userId: string | undefined) {
  const { addXp, useCredit } = useGameStore();
  const [isScanning, setIsScanning] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scanResult, setScanResult] = useState<{ score: number; feedback: string[]; fileName: string } | null>(null);

  const scanResumeFile = async (file: File) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    const success = useCredit();
    if (!success) {
      toast.error('Not enough energy to run the scanner!');
      return;
    }

    setIsScanning(true);
    setUploadProgress(0);
    setScanResult(null);

    try {
      // 1. Upload file ke Supabase Storage
      setUploadProgress(20);
      const filePath = `resumes/${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });
      if (uploadError) throw new Error(`Upload gagal: ${uploadError.message}`);
      setUploadProgress(50);

      // 2. Ekstrak teks dari file
      const fileContent = await extractTextFromFile(file);
      if (!fileContent.trim()) throw new Error('File kosong atau tidak terbaca.');
      setUploadProgress(70);

      // 3. Scan pake AI (dapetin score + feedback)
      const result = await scanResume(fileContent);
      setUploadProgress(90);

      // 4. Simpan hasil scan ke database (termasuk feedback)
      await dashboardService.saveCVScan(userId, result.score, file.name, result.feedback);

      setUploadProgress(100);
      addXp(50);
      
      // 5. Set hasil scan ke state lokal
      setScanResult({
        score: result.score,
        feedback: result.feedback,
        fileName: file.name,
      });

      toast.success(`Scan Complete! Score: ${result.score}% +50 XP`);
    } catch (error: any) {
      toast.error(`Scan failed: ${error.message}`);
    } finally {
      setIsScanning(false);
      setUploadProgress(0);
    }
  };

  const resetScan = () => setScanResult(null);

  return {
    isScanning,
    uploadProgress,
    scanResult,
    scanResume: scanResumeFile,
    resetScan,
  };
}