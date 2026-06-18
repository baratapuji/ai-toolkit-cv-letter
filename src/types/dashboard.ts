export interface CVScan {
  id: string;
  user_id: string;
  score: number;
  created_at: string;
  file_name?: string;
}

export interface CoverLetter {
  id: string;
  user_id: string;
  company_name: string;
  target_role: string;
  content: string;
  created_at: string;
}

export type DashboardLog = (CVScan & { type: 'ATS' }) | (CoverLetter & { type: 'LETTER' });