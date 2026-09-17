import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { PawMark } from './motion/PetIllustrations';

// Bento spans — index 0 is the hero tile, 3 is a tall tile, 5 is a wide tile.
// grid-flow-dense lets the rest pack in cleanly around them at any count.
const spanFor = (i) => {
  if (i === 0) return 'sm:col-span-2 sm:row-span-2';
  if (i === 3) return 'sm:row-span-2';
  if (i === 5) return 'sm:col-span-2';
  return '';
};

export default function HomeGallery({ images }) {
  const [active, setActive] = useState(null);
  const display = images.slice(0, 7);

  const close = () => setActive(null);
  const prev = (e) => { e?.stopPropagation(); setActive((i) => (i === 0 ? display.length - 1 : i - 1)); };
  const next = (e) => { e?.stopPropagation(); setActive((i) => (i === display.length - 1 ? 0 : i + 1)); };

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, display.length]);

  if (display.length === 0) return null;

  return (
    <section className="section-pad bg-bone relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-paw-print opacity-[0.04]" />
      <div
        aria-hidden="true"
        className="hidden lg:flex absolute -top-4 -left-4 w-24 h-24 rounded-full bg-paw-500/10 items-center justify-center animate-float"
      >
        <PawMark className="w-9 h-9 text-paw-400" />
      </div>

      <div className="container-lp relative">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <SectionHeading
            eyebrow="Gallery"
            title="Moments from around Lil Paws"
            description="A few handpicked snapshots — the full album is just a click away."
          />
          <Link to="/gallery" className="btn-ghost hidden sm:inline-flex items-center gap-1.5 shrink-0">
            View full gallery <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 sm:grid-flow-dense auto-rows-[140px] sm:auto-rows-[150px] gap-4">
          {display.map((img, i) => (
            <motion.button
              key={img._id}
              onClick={() => setActive(i)}
              data-cursor="View"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: (i % 7) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-2xl overflow-hidden group text-left ${spanFor(i)}`}
            >
              <img
                src={img.url}
                alt={img.altText || img.category}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
                  <Camera size={11} /> {img.category}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-7 sm:hidden">
          <Link to="/gallery" className="btn-ghost inline-flex items-center gap-1.5">
            View full gallery <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4"
          >
            <button onClick={close} className="absolute top-5 right-5 text-cream/80 hover:text-cream" aria-label="Close">
              <X size={28} />
            </button>
            {display.length > 1 && (
              <button onClick={prev} className="absolute left-3 sm:left-8 text-cream/80 hover:text-cream" aria-label="Previous image">
                <ChevronLeft size={32} />
              </button>
            )}
            <motion.img
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              src={display[active].url}
              alt={display[active].altText || display[active].category}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            />
            {display.length > 1 && (
              <button onClick={next} className="absolute right-3 sm:right-8 text-cream/80 hover:text-cream" aria-label="Next image">
                <ChevronRight size={32} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}