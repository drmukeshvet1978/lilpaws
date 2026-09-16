import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const close = () => setActiveIndex(null);
  const prev = (e) => {
    e?.stopPropagation();
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const next = (e) => {
    e?.stopPropagation();
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <>
      <div className="columns-2 sm:columns-3 gap-4 [column-fill:_balance]">
        {images.map((img, idx) => (
          <motion.button
            key={img._id}
            onClick={() => setActiveIndex(idx)}
            data-cursor="View"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (idx % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 block w-full break-inside-avoid rounded-xl overflow-hidden group relative"
          >
            <img
              src={img.url}
              alt={img.altText || img.category}
              loading="lazy"
              className="w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
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
            <button onClick={prev} className="absolute left-3 sm:left-8 text-cream/80 hover:text-cream" aria-label="Previous image">
              <ChevronLeft size={32} />
            </button>
            <motion.img
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              src={images[activeIndex].url}
              alt={images[activeIndex].altText}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            />
            <button onClick={next} className="absolute right-3 sm:right-8 text-cream/80 hover:text-cream" aria-label="Next image">
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
