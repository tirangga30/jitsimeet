import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  disablePaths?: string[];
  animation?: 'fade' | 'smoothSlide' | 'scale';
}

const animations: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  smoothSlide: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  disablePaths = [],
  animation = 'fade',
}) => {
  const location = useLocation();
  const isDisabled = disablePaths.some((path) => location.pathname.includes(path));

  if (isDisabled) return <>{children}</>;

  const variants = animations[animation] ?? animations.fade;

  return (
    <motion.div
      key={location.pathname}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{
        duration: 0.4,
        ease: [0.25, 0.8, 0.25, 1],
      }}
      variants={variants}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};
