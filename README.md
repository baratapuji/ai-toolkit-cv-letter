# 🎮 AI-TOOLKIT - Gamified AI Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Supabase-2-3ECF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/Zustand-4-000000?style=for-the-badge" />
</div>

<br />

> **"Secure Access Terminal — Where AI Meets Gamification"**

AI-TOOLKIT adalah platform berbasis **React + TypeScript** yang menggabungkan kekuatan **AI (Google Gemini)** dengan konsep **gamifikasi RPG**. Pengguna bisa scan CV, generate surat lamaran, naik level, mengumpulkan XP, membuka achievement, dan bersaing di leaderboard — semua dengan tampilan **retro-pixel cyberpunk**.

---

## ✨ Fitur Unggulan

| Fitur | Deskripsi |
|-------|-----------|
| 🎮 **Gamifikasi RPG** | Level, XP, Energy, Streak — semua elemen game lengkap! |
| 🤖 **AI CV Scanner** | Scan CV pake Google Gemini, dapet skor ATS + feedback |
| 📝 **AI Cover Letter** | Generate surat lamaran profesional + download .docx |
| 🏆 **Achievement System** | 6+ achievement dengan reward XP & Credits |
| 👑 **Leaderboard** | Ranking player berdasarkan total XP & achievement |
| ⚡ **Energy System** | Setiap aksi pake 1 Energy (recharge otomatis 24 jam) |
| 🔐 **Auth Terminal** | Login/Register dengan animasi epic "Preparing Arena" |
| 🎨 **Pixel UI** | Font Press Start 2P + efek glitch + neon glow |

---

## 🖥️ Tech Stack

### Frontend
- **React 19** + **TypeScript**
- **Vite** — build tool super cepat
- **Tailwind CSS** + **shadcn/ui** — styling
- **Zustand** — state management (dengan persist localStorage)
- **React Router** — navigasi

### Backend & Database
- **Supabase** — Auth + PostgreSQL + Storage
- **Google Gemini API** — AI generate CV scan & cover letter

### Library Pendukung
- `react-tsparticles` — background partikel
- `docx` — generate file Word (.docx)
- `pdf-parse` / `pdfjs-dist` — baca file PDF
- `mammoth` — baca file DOCX
- `lucide-react` — ikon

---

## 🗂️ Struktur Project
ai-toolkit-id/
├── src/
│ ├── components/
│ │ ├── auth/ # Login/Register screen
│ │ ├── dashboard/ # MainDashboard, CV Scanner, Cover Letter, Achievements, Leaderboard
│ │ ├── shared/ # Sidebar, Topbar
│ │ └── ui/ # shadcn/ui components
│ ├── hooks/ # useAuth, useCVScanner, useCoverLetter, useAchievements, useLeaderboard
│ ├── services/ # aiService, dashboardService, gameService, achievementService, leaderboardService
│ ├── store/ # useGameStore (Zustand)
│ ├── types/ # TypeScript interfaces
│ ├── lib/ # supabase client
│ ├── App.tsx
│ └── main.tsx
├── public/
├── .env.example # Template environment variables
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts


---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/username/ai-toolkit-id.git
cd ai-toolkit-id

npm install

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Gemini API
VITE_GEMINI_API_KEY=your-gemini-api-key

-- Tabel profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  university TEXT,
  major TEXT,
  avatar_url TEXT,
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  total_xp INT DEFAULT 0,
  xp_to_next_level INT DEFAULT 100,
  credits INT DEFAULT 5,
  streak INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel cv_scans
CREATE TABLE cv_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT,
  score INT,
  feedback JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel cover_letters
CREATE TABLE cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  target_role TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INT DEFAULT 0,
  credits_reward INT DEFAULT 0,
  condition_type TEXT,
  condition_value INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel user_achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Trigger auto create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

  INSERT INTO achievements (name, description, icon, xp_reward, credits_reward, condition_type, condition_value) VALUES
('First Scan', 'Scan your first CV', '🔍', 20, 1, 'scan_cv', 1),
('Scan Master', 'Scan 10 CVs', '📊', 50, 3, 'scan_cv', 10),
('Letter Writer', 'Generate your first cover letter', '✉️', 20, 1, 'generate_letter', 1),
('Letter Pro', 'Generate 10 cover letters', '📝', 50, 3, 'generate_letter', 10),
('Level Up!', 'Reach level 5', '⭐', 100, 5, 'level_up', 5),
('Streak Starter', 'Maintain 3-day streak', '🔥', 30, 2, 'streak', 3);

npm run dev

🎯 Game Mechanics
Level & XP
Setiap aksi (scan CV / generate letter) memberi XP

XP terkumpul → naik level → dapat +2 Energy

total_xp = akumulasi XP sepanjang masa (buat leaderboard)

Energy System
5 Energy default, recharge +5 setiap 24 jam

Setiap aksi habiskan 1 Energy

Kalo habis, harus tunggu recharge atau top-up

Achievements
Achievement	Syarat	Reward
First Scan	Scan 1 CV	+20 XP, +1 Energy
Scan Master	Scan 10 CV	+50 XP, +3 Energy
Letter Writer	Generate 1 Letter	+20 XP, +1 Energy
Letter Pro	Generate 10 Letters	+50 XP, +3 Energy
Level Up!	Reach Level 5	+100 XP, +5 Energy
Streak Starter	3 Days Streak	+30 XP, +2 Energy
Leaderboard Score
text
TOTAL SCORE = total_xp + (achievement_count × 10)
🎨 UI Theme
Font: Press Start 2P (pixel game)

Color Palette: Cyan (#06b6d4), Pink (#ec4899), Violet (#8b5cf6)

Effects: Glitch, Neon Glow, Shimmer, Particle System

Background: Animated grid + floating particles + glow orbs

🔐 Security Notes
API Keys: Semua API key disimpan di .env — jangan di-commit!

Supabase RLS: Aktifkan Row Level Security untuk proteksi data user.

CORS: Pastikan Supabase CORS diatur untuk domain lo.

🛠️ Troubleshooting
Masalah	Solusi
"Google API quota exceeded"	Tunggu 24 jam atau ganti model ke gemini-1.5-flash
"Failed to parse AI response"	Cek format CV, pastikan teks terbaca
"Profile not found"	Jalankan trigger handle_new_user di Supabase
"Build failed"	Hapus node_modules/.vite dan restart
🤝 Kontribusi
Fork repository

Buat branch baru (git checkout -b feature/amazing)

Commit perubahan (git commit -m 'Add amazing feature')

Push ke branch (git push origin feature/amazing)

Buka Pull Request

📄 License
MIT © 2026 MahasiswaBaru.id

<div align="center"> Made with ❤️ by Puji Barata <br /> <sub>⚡ "Level up your career with AI" ⚡</sub> </div> ```