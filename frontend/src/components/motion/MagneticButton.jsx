import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Wraps a single interactive child (button/link) and gives it a gentle
 * magnetic pull toward the cursor on desktop hover. Touch devices get
 * the plain, unwrapped interaction — no magnetism, no surprises.
 */
export default function MagneticButton({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: hover) and (pointer: fine)').matches === false) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPos({ x, y });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.4 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
