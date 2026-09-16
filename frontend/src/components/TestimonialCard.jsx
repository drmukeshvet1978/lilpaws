import { Star, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TestimonialCard({ testimonial, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white border border-ink/8 rounded-2xl p-7 flex flex-col gap-4 h-full overflow-hidden"
    >
      <span aria-hidden="true" className="absolute -top-3 right-4 text-[76px] font-display text-paw-500/[0.08] leading-none select-none">
        &rdquo;
      </span>
      <div className="flex gap-1 relative">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} className={i < testimonial.rating ? 'fill-paw-500 text-paw-500' : 'text-ink/15'} />
        ))}
      </div>
      <p className="text-ink/75 leading-relaxed text-[15px] relative">&ldquo;{testimonial.review}&rdquo;</p>
      <div className="flex items-center gap-3 mt-auto pt-2 relative">
        <div className="w-10 h-10 rounded-full bg-paw-50 flex items-center justify-center overflow-hidden shrink-0">
          {testimonial.photo?.url ? (
            <img src={testimonial.photo.url} alt={testimonial.customerName} className="w-full h-full object-cover" />
          ) : (
            <PawPrint size={16} className="text-paw-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{testimonial.customerName}</p>
          {testimonial.petName && <p className="text-xs text-ink/50">Parent of {testimonial.petName}</p>}
        </div>
      </div>
    </motion.div>
  );
}
