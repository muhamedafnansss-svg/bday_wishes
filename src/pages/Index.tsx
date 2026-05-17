import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/birthday/SplashScreen";
import { CinematicIntro } from "@/components/birthday/CinematicIntro";
import { MainBirthday } from "@/components/birthday/MainBirthday";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useDynamicTheme } from "@/features/core/theme/useDynamicTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { FloatingElements } from "@/components/birthday/FloatingElements";
import { MorphingElements } from "@/components/birthday/MorphingElements";
import { EnhancedFloatingElements } from "@/components/birthday/EnhancedFloatingElements";
import { SparkleRain } from "@/components/birthday/SparkleRain";
import { FireflyEffect } from "@/components/birthday/FireflyEffect";
import { FloatingOrbs } from "@/components/birthday/FloatingOrbs";
import { ShootingStars } from "@/components/birthday/ShootingStars";
import { AnimatedGradient } from "@/components/birthday/AnimatedGradient";

type Phase = "splash" | "intro" | "main";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("splash");
  const isMobile = useIsMobile();
  
  // Apply the dynamic theme globally to the body/app
  useDynamicTheme();

  return (
    <div 
      className="min-h-screen transition-colors duration-1000 relative overflow-hidden" 
      style={{ background: 'var(--bg-gradient, #000)' }}
    >
      {/* Multi-layer Background System */}
      <FloatingElements />
      <MorphingElements />
      <EnhancedFloatingElements />
      <AnimatedGradient />
      {phase === "main" && (
        <>
          <SparkleRain intensity={isMobile ? 8 : 15} />
          <FireflyEffect intensity={isMobile ? 7 : 12} />
          <FloatingOrbs count={isMobile ? 4 : 6} />
          <ShootingStars count={isMobile ? 4 : 8} />
        </>
      )}

      {/* Cinematic Overlays */}
      <div className="vignette" />



      <AnimatePresence mode="wait">
        {phase === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: isMobile ? "blur(0px)" : "blur(20px)" }}
            transition={{ duration: 1 }}
          >
            <SplashScreen onStart={() => setPhase("intro")} />
          </motion.div>
        )}

        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: isMobile ? "blur(0px)" : "blur(20px)" }}
            transition={{ duration: 1 }}
          >
            <CinematicIntro onComplete={() => setPhase("main")} />
          </motion.div>
        )}

        {phase === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 1.1, filter: isMobile ? "blur(0px)" : "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <MainBirthday />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
