import { motion } from 'framer-motion';

/**
 * Reveal — fades/slides a block into place once it enters the viewport.
 * Used sparingly: one entrance per section element, not stacked on every child.
 */
export function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 22,
  duration = 0.7,
  once = true,
  amount = 0.3,
  className = '',
}) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/**
 * RevealText — splits a heading into lines/words that reveal in a stagger.
 * Pass plain text as children. For short editorial headlines only.
 *
 * Implementation note: the visibility trigger (whileInView) is set on the
 * OUTER, untransformed tag, not on the individual word spans. Each word
 * span is hidden via `transform: translateY(110%)` inside an overflow-hidden
 * box — if the intersection observer watched that word span directly, it
 * would see zero intersection (the word is, by design, clipped out of its
 * own box) and the reveal would never fire, leaving the heading permanently
 * blank. Watching the outer tag instead and cascading the state to each
 * word via `variants` avoids that deadlock, and works reliably no matter
 * where on the page the heading sits.
 */
export function RevealText({ text, className = '', delay = 0, as: Tag = 'span', wordClassName = '', viewport = true }) {
  const words = String(text).split(' ').filter(Boolean);
  const MotionTag = motion[Tag] || motion.span;
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045, delayChildren: delay } },
  };
  const wordVariants = {
    hidden: { y: '110%' },
    show: { y: '0%', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      variants={container}
      {...(viewport ? { whileInView: 'show', viewport: { once: true, amount: 0.4 } } : { animate: 'show' })}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.28em]">
          <motion.span className={`inline-block ${wordClassName}`} variants={wordVariants}>
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Stagger — orchestrates a stagger animation across direct motion children */
export function Stagger({ children, className = '', gap = 0.08, delay = 0 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ staggerChildren: gap, delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}