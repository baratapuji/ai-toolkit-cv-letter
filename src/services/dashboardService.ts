import { supabase } from '@/lib/supabase';
import type { CVScan, CoverLetter, DashboardLog } from '@/types/dashboard'; // ← import tipe

export const dashboardService = {
  async saveCoverLetter(userId: string, company: string, role: string, content: string) {
    return supabase.from('cover_letters').insert({
      user_id: userId,
      company_name: company,
      target_role: role,
      content,
    });
  },

  // services/dashboardService.ts
  async saveCVScan(userId: string, score: number, fileName?: string, feedback?: string[]) {
    return supabase.from('cv_scans').insert({
      user_id: userId,
      score,
      filename: fileName,
      feedback: feedback || [], // simpan sebagai array JSON
    });
  },

  async updateProfile(userId: string, data: { name?: string; university?: string; major?: string }) {
    return supabase.from('profiles').update(data).eq('id', userId);
  },

  async getRecentLogs(userId: string, limit: number = 3): Promise<DashboardLog[]> {
  console.log('Fetching logs for userId:', userId);
  const [scansResult, lettersResult] = await Promise.all([
    supabase.from('cv_scans').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit),
    supabase.from('cover_letters').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit),
  ]);

  console.log('Scans result:', scansResult);
  console.log('Letters result:', lettersResult);

  if (scansResult.error) console.error('Scans error:', scansResult.error);
  if (lettersResult.error) console.error('Letters error:', lettersResult.error);

  const combined = [
    ...(scansResult.data?.map(s => ({ ...s, type: 'ATS' })) || []),
    ...(lettersResult.data?.map(l => ({ ...l, type: 'LETTER' })) || []),
  ];
  return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
};