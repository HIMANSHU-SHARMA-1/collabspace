import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    
    const onMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out"
      });
    };

    // Hover interactions
    const handleHover = () => {
      gsap.to(cursor, { scale: 1.5, duration: 0.2 });
    };
    
    const handleHoverOut = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    };

    const addListeners = () => {
      const interactables = document.querySelectorAll('a, button, input, textarea');
      interactables.forEach(el => {
        el.addEventListener('mouseenter', handleHover);
        el.addEventListener('mouseleave', handleHoverOut);
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    
    // Add hover listeners with a slight delay to allow dom elements to mount
    const timeout = setTimeout(addListeners, 500);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(timeout);
      
      const interactables = document.querySelectorAll('a, button, input, textarea');
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleHoverOut);
      });
    };
  }, []);

  return <div className="custom-cursor" ref={cursorRef}></div>;
};

export default CustomCursor;
