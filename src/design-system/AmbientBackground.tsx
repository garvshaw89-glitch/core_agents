import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface AmbientBackgroundProps {
  className?: string;
  variant?: 'subtle' | 'standard' | 'focused';
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  className = '',
  variant = 'standard',
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Opacity adjustments based on variant
  const opacityMultiplier = variant === 'subtle' ? 0.6 : variant === 'focused' ? 1.2 : 1.0;

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Deep base vignette */}
      <div className="absolute inset-0 bg-[#080B16]" />

      {/* Primary Electric Cyan Ambient Light Field */}
      <motion.div
        className="absolute -top-[15%] left-[8%] w-[55vw] max-w-[850px] h-[55vw] max-h-[850px] rounded-full blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(56, 217, 255, 0.08) 0%, rgba(56, 217, 255, 0.02) 40%, transparent 70%)',
          opacity: 0.95 * opacityMultiplier,
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, 35, -25, 0],
                y: [0, -25, 20, 0],
                scale: [1, 1.05, 0.98, 1],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary Vibrant Violet Ambient Aura */}
      <motion.div
        className="absolute top-[20%] -right-[8%] w-[50vw] max-w-[750px] h-[50vw] max-h-[750px] rounded-full blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.07) 0%, rgba(139, 92, 246, 0.02) 45%, transparent 70%)',
          opacity: 0.85 * opacityMultiplier,
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, -30, 20, 0],
                y: [0, 35, -15, 0],
                scale: [1, 0.96, 1.06, 1],
              }
        }
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Bottom Subterranean Cyan/Violet Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85vw] max-w-[1300px] h-[340px] blur-[160px] opacity-35"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(56, 217, 255, 0.07) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 80%)',
        }}
      />

      {/* Micro-grid overlay with soft vignette */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.35) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)',
        }}
      />
    </div>
  );
};
