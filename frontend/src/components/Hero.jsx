import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, ArrowDown } from 'lucide-react';
import useSiteSettings from '../hooks/useSiteSettings';
import { RevealText } from './motion/Reveal';
import MagneticButton from './motion/MagneticButton';
import { PawMark } from './motion/PetIllustrations';

export default function Hero({ hero }) {
  const { settings } = useSiteSettings();
  const images = hero?.images?.length ? hero.images : [];
  const titleLines = (hero?.title?.trim() ? hero.title : 'Where Every Paw Matters').split('\n');

  return (
    <section className="relative overflow-hidden bg-cream">
      {/* decorative orange blob behind the composition */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -top-24 right-[-10%] w-[560px] h-[560px] rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-paw-100/70 blur-[2px] animate-breathe"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-paw-print opacity-60" />

      {/* floating paw + pet accents */}
      <motion.div
        aria-hidden="true"
        className="hidden md:block absolute top-[18%] left-[6%] w-10 h-10 text-paw-300 animate-float"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <PawMark className="w-full h-full" />
      </motion.div>
      <div className="container-lp relative grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center pt-10 sm:pt-16 pb-20 sm:pb-28">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="eyebrow bg-paw-100 px-3.5 py-1.5 rounded-full mb-6"
          >
            <PawMark className="w-3.5 h-3.5" /> Kolar Road, Bhopal
          </motion.span>

          <h1 className="font-display font-semibold leading-[0.98] text-ink text-balance text-4xl sm:text-6xl lg:text-[4.4rem]">
            {titleLines.map((l, i) => (
              <RevealText key={i} as="div" text={l} delay={0.2 + i * 0.18} viewport={false} />
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-7 text-lg text-ink/65 leading-relaxed max-w-lg"
          >
            {hero?.subtitle ||
              'Lil Paws Dog Clinic & Pet Shop brings veterinary care and everyday pet essentials together, right on Kolar Road, Bhopal.'}
          </motion.p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
              <MagneticButton>
                <Link to={hero?.primaryCtaLink || '/appointments'} className="btn-primary" data-cursor="Book">
                  {hero?.primaryCtaText || 'Book an Appointment'} <ArrowRight size={17} />
                </Link>
              </MagneticButton>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }}>
              <Link to={hero?.secondaryCtaLink || '/services'} className="btn-secondary">
                {hero?.secondaryCtaText || 'Explore Services'}
              </Link>
            </motion.div>
          </div>

          {settings?.phone && (
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.05 }}
              href={`tel:${settings.phone}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink/70 hover:text-paw-600"
            >
              <Phone size={16} /> {settings.phone}
            </motion.a>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotate: -1.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="relative"
        >
          <div className="relative rounded-paw overflow-hidden bg-bone aspect-[4/5] max-w-md mx-auto shadow-soft">
            {images[0] ? (
              <img src={images[0].url} alt={images[0].altText || 'Lil Paws'} className="w-full h-full object-cover" />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-paw-print overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute w-[85%] h-[85%] rounded-full bg-paw-200/50 blur-2xl"
                />
                <PawMark className="relative w-24 h-24 text-paw-400/70" />
              </div>
            )}
          </div>
          {images[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="hidden sm:block absolute -bottom-8 -left-8 w-40 h-40 rounded-2xl overflow-hidden shadow-soft border-4 border-cream animate-float-slow"
            >
              <img src={images[1].url} alt={images[1].altText || 'Lil Paws'} className="w-full h-full object-cover" />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.1, type: 'spring', stiffness: 200, damping: 16 }}
            className="hidden sm:flex absolute -top-6 -right-4 w-24 h-24 rounded-full bg-white shadow-soft items-center justify-center border border-ink/5"
          >
            <PawMark className="w-9 h-9 text-paw-500" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-ink/40"
      >
        <span className="text-[11px] font-semibold tracking-wide">Scroll</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={16} />
        </motion.span>
      </motion.div>
    </section>
  );
}