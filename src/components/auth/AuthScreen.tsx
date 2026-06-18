import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Fingerprint, AlertTriangle, ArrowRight, Sparkles, Sword, Crown, User, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function AuthScreen() {
  const { signIn, signUp, createProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  
  // Loading state
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleToggle = () => {
    if (isTransitioning) return;
    setGlitchActive(true);
    setIsTransitioning(true);
    setTimeout(() => {
      setIsRegistering(!isRegistering);
      setGlitchActive(false);
    }, 300);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setShowLoading(true);
    setAuthSuccess(false);
    setLoadingProgress(0);
    setIsLoading(true);
    
    // 🔥 STATUS SEQUENCE BERBEDA ANTARA LOGIN & REGISTER
    const phases = isRegistering 
      ? [
          { progress: 10, status: "🖐️ INITIALIZING IDENTITY..." },
          { progress: 25, status: "🔍 SCANNING BIOMETRICS..." },
          { progress: 40, status: "⚡ ENCRYPTING NEURAL LINK..." },
          { progress: 55, status: "🌐 CONNECTING TO DATABASE..." },
          { progress: 70, status: "🧬 SYNTHESIZING PROFILE..." },
          { progress: 85, status: "🏗️ BUILDING CHARACTER..." },
          { progress: 95, status: "✨ FINALIZING..." },
          { progress: 100, status: "🏆 IDENTITY CREATED!" },
        ]
      : [
          { progress: 10, status: "🛡️ INITIALIZING SECURE LINK..." },
          { progress: 25, status: "🔍 VERIFYING CREDENTIALS..." },
          { progress: 40, status: "⚡ DECRYPTING ACCESS TOKEN..." },
          { progress: 55, status: "🌐 ESTABLISHING CONNECTION..." },
          { progress: 70, status: "🔐 AUTHENTICATING PROTOCOL..." },
          { progress: 85, status: "⚔️ PREPARING ARENA..." },
          { progress: 95, status: "✨ FINALIZING..." },
          { progress: 100, status: "🏆 ACCESS GRANTED!" },
        ];

    // Jalankan progres
    for (const phase of phases) {
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
      setLoadingProgress(phase.progress);
      setLoadingStatus(phase.status);
    }

    // Eksekusi auth
    try {
      if (isRegistering) {
        const { data, error } = await signUp(email, password);
        if (error) throw error;
        
        // 🔥 Buat profil di database (pake trigger atau manual)
        if (data?.user?.id && createProfile) {
          await createProfile(data.user.id, email);
        }
        
        toast.success("Identity Created! You can now Initialize Link.", {
          icon: <Fingerprint className="w-4 h-4 text-cyan-400" />
        });
        setAuthSuccess(true);
        setTimeout(() => {
          setShowLoading(false);
          setIsRegistering(false);
          setIsLoading(false);
          setLoadingProgress(0);
          setAuthSuccess(false);
        }, 1500);
      } else {
        await signIn(email, password);
        toast.success("Authentication Protocol Accepted", {
          icon: <Fingerprint className="w-4 h-4 text-cyan-400" />
        });
        setAuthSuccess(true);
        setTimeout(() => {
          setShowLoading(false);
          setIsLoading(false);
          setLoadingProgress(0);
          setAuthSuccess(false);
        }, 1500);
      }
    } catch (error: any) {
      toast.error(`Access Denied: ${error.message || "Unknown error"}`, {
        icon: <AlertTriangle className="w-4 h-4 text-red-500" />
      });
      setShowLoading(false);
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  // ============================================
  // LOADING SCREEN (BEDA REGISTER VS LOGIN)
  // ============================================
  if (showLoading) {
    const isRegisterMode = isRegistering;
    const isSuccess = authSuccess;

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 animate-in fade-in duration-500">
        <div className="max-w-md w-full">
          <div className={`game-panel p-8 rounded-2xl border shadow-[0_0_60px_rgba(6,182,212,0.15)] relative overflow-hidden ${
            isRegisterMode 
              ? 'border-pink-500/20 shadow-[0_0_60px_rgba(236,72,153,0.15)]' 
              : 'border-cyan-500/20'
          }`}>
            
            {/* Background glow beda warna */}
            <div className={`absolute inset-0 pointer-events-none ${
              isRegisterMode 
                ? 'bg-gradient-to-b from-pink-500/5 via-violet-500/5 to-transparent' 
                : 'bg-gradient-to-b from-cyan-500/5 via-blue-500/5 to-transparent'
            }`}></div>
            
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-${
                isRegisterMode ? 'pink' : 'cyan'
              }-400/30 to-transparent animate-[pulse_0.5s_ease-in-out_infinite]`}></div>
              <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-${
                isRegisterMode ? 'violet' : 'pink'
              }-400/30 to-transparent animate-[pulse_0.7s_ease-in-out_infinite]`}></div>
            </div>

            <div className="relative z-10 text-center space-y-8">
              {/* Icon — BEDA BUAT REGISTER */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full blur-2xl animate-pulse ${
                    isRegisterMode ? 'bg-pink-500/20' : 'bg-cyan-500/20'
                  }`}></div>
                  <div className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)] ${
                    isRegisterMode 
                      ? 'bg-gradient-to-br from-pink-600 to-violet-600 shadow-[0_0_40px_rgba(236,72,153,0.4)]' 
                      : 'bg-gradient-to-br from-cyan-600 to-blue-600'
                  }`}>
                    {isSuccess ? (
                      isRegisterMode ? (
                        <User className="w-10 h-10 text-green-400 animate-bounce" />
                      ) : (
                        <Crown className="w-10 h-10 text-yellow-400 animate-bounce" />
                      )
                    ) : (
                      isRegisterMode ? (
                        <Fingerprint className="w-10 h-10 text-white animate-pulse" />
                      ) : (
                        <Sword className="w-10 h-10 text-white animate-pulse" />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Title — BEDA */}
              <h3 className={`font-pixel text-xl text-white tracking-widest ${
                isSuccess && isRegisterMode ? 'text-green-400' : ''
              }`}>
                {isSuccess ? (
                  isRegisterMode ? '🎮 CHARACTER CREATED!' : '🎮 READY TO FIGHT!'
                ) : (
                  isRegisterMode ? '⚔️ FORGING IDENTITY...' : '⚔️ PREPARING ARENA...'
                )}
              </h3>
              
              {/* Status */}
              <p className={`font-pixel text-xs tracking-widest animate-pulse ${
                isRegisterMode ? 'text-pink-400' : 'text-cyan-400'
              }`}>
                {loadingStatus}
              </p>

              {/* Progress bar — BEDA WARNA */}
              <div className="w-full space-y-2">
                <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${
                      isSuccess 
                        ? 'from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]' 
                        : isRegisterMode
                          ? 'from-pink-500 to-violet-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                          : 'from-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    }`}
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="font-pixel text-xs text-zinc-500 tracking-widest">
                  {loadingProgress}%
                </p>
              </div>

              {/* Loading tips — BEDA */}
              <div className={`text-[8px] font-pixel tracking-widest animate-pulse ${
                isRegisterMode ? 'text-pink-600' : 'text-cyan-600'
              }`}>
                {isSuccess 
                  ? (isRegisterMode ? '✦ WELCOME TO THE ARENA ✦' : '✦ PRESS ANY KEY TO CONTINUE ✦')
                  : (isRegisterMode ? '✦ SYNCHRONIZING SOUL ✦' : '✦ SYNCHRONIZING NEURAL INTERFACE ✦')
                }
              </div>

              {/* Glitch particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full animate-ping ${
                      isRegisterMode ? 'bg-pink-400/30' : 'bg-cyan-400/30'
                    }`}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDuration: `${1 + Math.random() * 2}s`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // TAMPILAN NORMAL (LOGIN/REGISTER FORM)
  // ============================================
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 animate-in fade-in zoom-in-95 duration-700">
      <div className="max-w-md w-full">
        
        {/* HEADER */}
        <div className="text-center mb-10 relative">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-pixel text-white tracking-widest relative">
              AI<span className="text-cyan-400">TOOLKIT</span>
              {glitchActive && (
                <span className="absolute inset-0 text-cyan-400 animate-pulse opacity-50 blur-[2px] select-none">
                  AI<span className="text-pink-500">TOOLKIT</span>
                </span>
              )}
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <p className={`font-pixel text-xs tracking-widest uppercase transition-all duration-300 ${
            glitchActive ? 'text-pink-500 animate-pulse' : 'text-zinc-400'
          }`}>
            {isTransitioning ? '⟳ REBOOTING SYSTEM...' : isRegistering ? 'CREATE NEW IDENTITY' : 'SECURE ACCESS TERMINAL'}
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-3"></div>
        </div>

        {/* CARD */}
        <div className={`game-panel p-8 rounded-2xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.08)] transition-all duration-500 ${
          glitchActive ? 'border-pink-500/50 shadow-[0_0_60px_rgba(236,72,153,0.2)]' : ''
        }`}>
          
          {/* Toggle */}
          <div className="flex rounded-xl bg-black/40 p-1 mb-6 border border-white/5 relative overflow-hidden">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-gradient-to-r transition-all duration-300 ${
                isRegistering 
                  ? 'from-pink-600 to-violet-600 left-[calc(50%+2px)]' 
                  : 'from-cyan-600 to-blue-600 left-1'
              }`}
            />
            <button
              type="button"
              onClick={handleToggle}
              disabled={isTransitioning}
              className={`flex-1 py-2.5 px-4 rounded-lg font-pixel text-[10px] tracking-widest uppercase transition-all duration-300 relative z-10 ${
                !isRegistering ? 'text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {isTransitioning && !isRegistering ? '⟳' : 'Login'}
            </button>
            <button
              type="button"
              onClick={handleToggle}
              disabled={isTransitioning}
              className={`flex-1 py-2.5 px-4 rounded-lg font-pixel text-[10px] tracking-widest uppercase transition-all duration-300 relative z-10 ${
                isRegistering ? 'text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {isTransitioning && isRegistering ? '⟳' : 'Register'}
            </button>
          </div>

          {/* FORM */}
          <div className={`transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isTransitioning 
              ? 'scale-95 rotate-[-2deg] skew-x-[3deg] opacity-0 blur-[2px]' 
              : 'scale-100 rotate-0 skew-x-0 opacity-100 blur-0'
          }`}>
            <form onSubmit={handleAuth} className="space-y-5 relative z-10">
              <div className="space-y-2">
                <Label className="text-zinc-400 font-pixel text-[10px] tracking-widest uppercase flex items-center gap-2">
                  <span className={`transition-colors duration-300 ${isRegistering ? 'text-pink-400' : 'text-cyan-400'}`}>◆</span> 
                  {isRegistering ? 'IDENTITY' : 'EMAIL'}
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRegistering ? "new.player@domain.com" : "player@indonesia.com"}
                  required
                  className={`bg-black/50 border h-12 rounded-xl font-pixel text-sm tracking-wider px-4 transition-all duration-300 ${
                    isRegistering 
                      ? 'border-pink-500/30 focus-visible:ring-pink-500' 
                      : 'border-cyan-500/30 focus-visible:ring-cyan-500'
                  } text-white placeholder:text-zinc-600`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-zinc-400 font-pixel text-[10px] tracking-widest uppercase flex items-center gap-2">
                    <span className={`transition-colors duration-300 ${isRegistering ? 'text-pink-400' : 'text-cyan-400'}`}>◆</span> 
                    PASSCODE
                  </Label>
                  {!isRegistering && (
                    <button type="button" className="font-pixel text-[10px] text-zinc-500 hover:text-cyan-400 transition-colors tracking-widest uppercase">
                      Forgot?
                    </button>
                  )}
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`bg-black/50 border h-12 rounded-xl font-pixel text-sm tracking-wider px-4 transition-all duration-300 ${
                    isRegistering 
                      ? 'border-pink-500/30 focus-visible:ring-pink-500' 
                      : 'border-cyan-500/30 focus-visible:ring-cyan-500'
                  } text-white placeholder:text-zinc-600`}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || isTransitioning}
                className={`w-full h-14 text-sm font-pixel tracking-widest uppercase text-white transition-all duration-300 rounded-xl border-none group ${
                  isRegistering
                    ? 'bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 shadow-[0_0_25px_rgba(236,72,153,0.2)] hover:shadow-[0_0_40px_rgba(236,72,153,0.4)]'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      PROCESSING...
                    </>
                  ) : isTransitioning ? (
                    '⟳ REBOOTING...'
                  ) : isRegistering ? (
                    <>
                      <Fingerprint className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      CREATE IDENTITY
                    </>
                  ) : (
                    <>
                      INITIALIZE LINK
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={handleToggle}
                  disabled={isTransitioning}
                  className="font-pixel text-[10px] text-zinc-500 hover:text-white tracking-widest uppercase transition-all duration-300 group"
                >
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-[-4px]">
                    {isRegistering ? '←' : ''}
                  </span>
                  {isTransitioning ? '⟳' : isRegistering ? 'Already have an identity? Login' : 'No identity? Register here →'}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-[4px]">
                    {!isRegistering ? '→' : ''}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* FOOTER */}
          <div className={`mt-6 pt-4 border-t border-white/5 flex justify-center gap-4 text-[8px] font-pixel tracking-widest transition-colors duration-300 ${
            isRegistering ? 'text-pink-600' : 'text-cyan-600'
          }`}>
            <span>✦ SECURE CONNECTION</span>
            <span className="text-zinc-700">◆</span>
            <span>V.4.2.0</span>
            <span className="text-zinc-700">◆</span>
            <span className={`${isRegistering ? 'text-pink-500' : 'text-cyan-500'}`}>
              {isRegistering ? 'MODE: CREATE' : 'MODE: LOGIN'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}