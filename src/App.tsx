import { Toaster } from "./components/ui/sonner";
import { AuthScreen } from "./components/auth/AuthScreen";
import { Dashboard } from "./components/dashboard/Dashboard";
import { useGameStore } from "./store/useGameStore";
import { useEffect, useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

function App() {
  const { rechargeEnergy, isAuthenticated } = useGameStore();

  useEffect(() => {
    rechargeEnergy();
  }, [rechargeEnergy]);

  // Inisialisasi particles
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="dark flex min-h-screen text-zinc-50 font-sans relative overflow-hidden bg-[#050505]">
      
      {/* ============================================
          AURORA BACKGROUND (BLOB WARNA-WARNI)
          ============================================ */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-violet-500/20 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite]"></div>
        
        {/* Grid halus (opsional) */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      </div>

      {/* ============================================
          PARTICLES (BERGERAK + GARIS)
          ============================================ */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 pointer-events-none"
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
            },
          },
          particles: {
            color: {
              value: ["#ec4899", "#8b5cf6", "#06b6d4", "#f59e0b"],
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.1,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "out" },
              random: false,
              speed: 1.2,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 70,
            },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />

      {/* CONTENT UTAMA */}
      {!isAuthenticated ? <AuthScreen /> : <Dashboard />}
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;