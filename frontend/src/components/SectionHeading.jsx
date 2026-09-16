import { Reveal, RevealText } from './motion/Reveal';

export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <Reveal y={10}>
          <p className="eyebrow mb-3">{eyebrow}</p>
        </Reveal>
      )}
      <h2 className="text-3xl sm:text-4xl font-display font-semibold text-ink leading-tight text-balance">
        <RevealText text={title} />
      </h2>
      {description && (
        <Reveal delay={0.15}>
          <p className="mt-4 text-ink/65 leading-relaxed">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
