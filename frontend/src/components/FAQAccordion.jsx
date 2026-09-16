import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQAccordion({ faqs }) {
  const [openId, setOpenId] = useState(faqs?.[0]?._id || null);

  return (
    <div className="divide-y divide-ink/10 border-t border-b border-ink/10">
      {faqs.map((faq, i) => {
        const isOpen = openId === faq._id;
        return (
          <motion.div
            key={faq._id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : faq._id)}
              className="w-full flex items-center gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className={`shrink-0 text-sm font-display font-semibold ${isOpen ? 'text-paw-600' : 'text-ink/30'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`flex-1 font-semibold ${isOpen ? 'text-ink' : 'text-ink/80'}`}>{faq.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className="shrink-0 text-paw-600"
              >
                <Plus size={20} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="text-ink/65 leading-relaxed pb-5 pl-9 pr-8">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
