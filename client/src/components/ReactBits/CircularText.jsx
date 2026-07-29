import { useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'motion/react';

import './CircularText.css';

const getRotationTransition = (duration, from, loop = true, direction = 1) => ({
  from,
  to: from + (360 * direction),
  ease: 'linear',
  duration,
  type: 'tween',
  repeat: loop ? Infinity : 0
});

const getTransition = (duration, from, direction = 1) => ({
  rotate: getRotationTransition(duration, from, true, direction),
  scale: {
    type: 'spring',
    damping: 20,
    stiffness: 300
  }
});

const CircularText = ({ text, spinDuration = 20, onHover = 'speedUp', className = '', spinDirection = 1 }) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + (360 * spinDirection),
      scale: 1,
      transition: getTransition(spinDuration, start, spinDirection)
    });
  }, [spinDuration, text, onHover, controls, rotation, spinDirection]);

  const handleHoverStart = () => {
    const start = rotation.get();
    if (!onHover) return;

    let transitionConfig;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start, spinDirection);
        break;
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start, spinDirection);
        break;
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 }
        };
        scaleVal = 1;
        break;
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start, spinDirection);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start, spinDirection);
    }

    controls.start({
      rotate: start + (360 * spinDirection),
      scale: scaleVal,
      transition: transitionConfig
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + (360 * spinDirection),
      scale: 1,
      transition: getTransition(spinDuration, start, spinDirection)
    });
  };

  return (
    <motion.div
      className={`circular-text ${className}`}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const factor = Math.PI / letters.length;
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span key={i} style={{ transform, WebkitTransform: transform }}>
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
