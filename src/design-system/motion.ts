/**
 * Centralized Motion Graphics Tokens & Animation Variants
 * Adheres to WCAG AA, prefers-reduced-motion, and ultra-smooth 60fps compositor transitions.
 */

export const motionTokens = {
  duration: {
    instant: 0.1,
    fast: 0.16,
    normal: 0.24,
    slow: 0.36,
    ambient: 12,
  },
  ease: {
    out: [0.16, 1, 0.3, 1] as const,
    inOut: [0.4, 0, 0.2, 1] as const,
    smooth: [0.22, 1, 0.36, 1] as const,
  },
};

export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.ease.out,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.inOut,
    },
  },
};

export const cardMotionVariants = {
  initial: { opacity: 0, y: 12 },
  animate: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.normal,
      delay: Math.min(index * 0.04, 0.24),
      ease: motionTokens.ease.out,
    },
  }),
  hover: {
    y: -2,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.out,
    },
  },
  tap: {
    scale: 0.99,
  },
};

export const drawerMotionVariants = {
  initial: { x: '100%', opacity: 0.8 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.ease.out,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.inOut,
    },
  },
};

export const modalMotionVariants = {
  initial: { opacity: 0, scale: 0.96, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.ease.out,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.inOut,
    },
  },
};
