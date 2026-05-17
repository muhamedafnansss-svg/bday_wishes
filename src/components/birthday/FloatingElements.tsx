import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatingItem {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  element: string;
  depth: number;
}

export const FloatingElements = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const relationship = useBirthdayStore(state => state.config.relationship);
  const { scrollY } = useScroll();
  const isMobile = useIsMobile();

  useEffect(() => {
    const elementsList = 
      relationship === 'partner' ? ['💖', '✨', '🌹', '💫', '❤️', '💍'] :
      relationship === 'friend' ? ['🎉', '😎', '🎈', '⭐', '🍕', '🍻'] :
      ['✨', '🌟', '💝', '🌸', '🎈', '🎁'];

    // Template-specific physics
    const particleSpeed = 
      relationship === 'partner' ? 1.5 : 
      relationship === 'friend' ? 0.5 : 1; // Lower duration = faster

    const newItems = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 2.5,
      duration: (20 + Math.random() * 40) * particleSpeed,
      delay: Math.random() * -30,
      element: elementsList[Math.floor(Math.random() * elementsList.length)],
      depth: 1 + Math.random() * 3, 
    }));

    setItems(newItems);
  }, [relationship]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Atmosphere Blobs (Layer 1) */}
      <div className={`absolute inset-0 opacity-20 ${isMobile ? '' : 'blur-[120px]'}`}>
        <motion.div 
          animate={{ 
            x: [0, 150, 0], 
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-[40rem] h-[40rem] rounded-full"
          style={{ background: isMobile ? 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' : 'hsl(var(--primary))' }}
        />
        <motion.div 
          animate={{ 
            x: [0, -150, 0], 
            y: [0, -80, 0],
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-20 w-[45rem] h-[45rem] rounded-full"
          style={{ background: isMobile ? 'radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)' : 'hsl(var(--secondary))' }}
        />
      </div>

      {/* Floating Emojis (Layer 2 & 3 with Parallax) */}
      {items.map(item => (
        <ParallaxItem key={item.id} item={item} scrollY={scrollY} isMobile={isMobile} />
      ))}
    </div>
  );
};

const ParallaxItem = ({ item, scrollY, isMobile }: { item: FloatingItem; scrollY: any; isMobile: boolean }) => {
  const y = useTransform(scrollY, [0, 2000], [0, -item.depth * 400]);

  return (
    <motion.div
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        fontSize: `${item.size}rem`,
        opacity: 0.15 / item.depth,
        filter: isMobile ? `blur(${Math.max(0, item.depth - 2)}px)` : `blur(${item.depth - 1}px)`,
        willChange: "transform",
        y,
      }}
      initial={{ y: 0 }}
      animate={{ 
        x: [0, 30, 0],
        rotate: [0, 20, -20, 0]
      }}
      transition={{ 
        duration: item.duration, 
        repeat: Infinity, 
        delay: item.delay,
        ease: "easeInOut"
      }}
      className="absolute"
    >
      {item.element}
    </motion.div>
  );
};
