// components/dashboard/Dashboard.tsx
import { Sidebar } from "../shared/Sidebar";
import { Topbar } from "../shared/Topbar";
import { useGameStore } from "../../store/useGameStore";
import { CvAtsChecker } from "./CvAtsChecker";
import { CoverLetterAi } from "./CoverLetterAi";
import { MainDashboard } from "./MainDashboard";
import { ProfileSettings } from "./ProfileSettings";
import { Achievements } from "./Achievements";
import { Leaderboard } from "./Leaderboard";

export function Dashboard() {
  const { activeView } = useGameStore();

  return (
    <div className="flex w-full z-10 relative animate-in fade-in duration-700 h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <Topbar />
        <div className="flex-1 p-10 flex flex-col items-center justify-center">
          {activeView === 'dashboard' && <MainDashboard />}
          {activeView === 'cv-checker' && <CvAtsChecker />}
          {activeView === 'cover-letter' && <CoverLetterAi />}
          {activeView === 'profile' && <ProfileSettings />}
          {activeView === 'achievements' && <Achievements />}
          {activeView === 'leaderboard' && <Leaderboard />}
        </div>
      </main>
    </div>
  );
}