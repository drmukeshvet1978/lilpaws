import { motion } from 'framer-motion';

/**
 * A single-line, minimal dog illustration in the brand's ink/orange
 * palette. Subtle looping motion only — breathing, an occasional
 * blink, a wagging tail. Never a static, lifeless icon.
 */
export function DogMark({ className = '', color = '#151312', accent = '#F0800E' }) {
  return (
    <motion.svg
      viewBox="0 0 260 220"
      className={className}
      animate={{ scale: [1, 1.012, 1] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* body */}
      <path
        d="M60 150c-6-28 8-56 34-70 22-12 50-12 70 2 20 14 30 38 24 62-4 16-16 28-32 32-8 26-30 36-56 32-24-4-38-24-40-48Z"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* ear */}
      <path d="M84 90c-10-18-8-38 6-50 8 16 10 34 4 52" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M150 84c14-14 20-32 14-50-12 12-20 28-20 46" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* eye (blinks) */}
      <motion.ellipse
        cx="112"
        cy="118"
        rx="4.5"
        ry="6"
        fill={color}
        animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
        transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.85, 0.9, 0.95, 1], ease: 'easeInOut' }}
      />
      {/* nose */}
      <ellipse cx="150" cy="128" rx="6" ry="4.5" fill={color} />
      {/* mouth */}
      <path d="M150 133c-4 8-14 12-22 8" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
      {/* tail — wags */}
      <motion.path
        d="M62 146c-14 2-26-4-32-16"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        style={{ transformOrigin: '62px 146px' }}
        animate={{ rotate: [-6, 10, -6] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* accent collar */}
      <path d="M92 158c14 6 32 6 46-2" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
    </motion.svg>
  );
}

export function CatMark({ className = '', color = '#151312', accent = '#F0800E' }) {
  return (
    <motion.svg
      viewBox="0 0 240 220"
      className={className}
      animate={{ scale: [1, 1.012, 1] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path
        d="M70 150c-8-30 6-58 34-70 20-8 44-6 60 8 16 14 22 36 16 58-6 20-22 32-42 34-22 2-40-8-52-24-6 8-12 6-16-6Z"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M78 92 68 58l30 22" fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" />
      <path d="M138 84l6-36 26 26" fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" />
      <motion.ellipse
        cx="118"
        cy="122"
        rx="4.5"
        ry="6"
        fill={color}
        animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.85, 0.9, 0.95, 1], ease: 'easeInOut' }}
      />
      <path d="M96 132c-10-2-18 0-24 6M140 132c10-2 18 0 24 6" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="118" cy="134" rx="5" ry="4" fill={accent} />
      <motion.path
        d="M172 150c14 6 22 20 18 34"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        style={{ transformOrigin: '172px 150px' }}
        animate={{ rotate: [-4, 8, -4] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

export function PawMark({ className = '', color = '#F0800E' }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill={color}>
      <ellipse cx="30" cy="40" rx="15" ry="12" />
      <circle cx="14" cy="20" r="6.5" />
      <circle cx="30" cy="12" r="7" />
      <circle cx="46" cy="20" r="6.5" />
    </svg>
  );
}

/** A soft trail of paw prints that fade in progressively on scroll, alternating sides */
export function PawTrail({ count = 5, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-8 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.35, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: i * 0.12 }}
          style={{ marginLeft: i % 2 === 0 ? -18 : 18, transform: `rotate(${i % 2 === 0 ? -18 : 18}deg)` }}
        >
          <PawMark className="w-5 h-5" />
        </motion.div>
      ))}
    </div>
  );
}
