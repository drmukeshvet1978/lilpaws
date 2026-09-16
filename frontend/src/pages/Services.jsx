import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import { Loader, EmptyState } from '../components/States';
import { serviceApi } from '../api/services';

const CATEGORIES = [
  'All',
  'Veterinary Consultation',
  'General Pet Care',
  'Preventive Care',
  'Diagnostics',
  'Vaccination',
  'Grooming / Hygiene',
  'Other',
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    serviceApi.getAll().then((res) => setServices(res.data.services)).finally(() => setLoading(false));
  }, []);

  const filtered = category === 'All' ? services : services.filter((s) => s.category === category);

  return (
    <section className="section-pad bg-paw-print">
      <div className="container-lp">
        <SectionHeading eyebrow="Services" title="Care for your dog, all in one place" align="center" />

        <div className="flex flex-wrap justify-center gap-2 mt-9">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`relative px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                category === c ? 'text-cream border-ink' : 'border-ink/15 text-ink/70 hover:border-paw-500'
              }`}
            >
              {category === c && (
                <motion.span layoutId="services-pill" className="absolute inset-0 bg-ink rounded-full -z-10" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
              )}
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {loading ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <EmptyState title="No services listed yet" description="Please check back soon, or contact us directly for details." />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={category}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filtered.map((s, i) => <ServiceCard key={s._id} service={s} index={i} />)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
