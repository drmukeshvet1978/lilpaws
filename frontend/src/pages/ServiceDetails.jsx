import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Clock, IndianRupee, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Loader, ErrorState } from '../components/States';
import { Reveal } from '../components/motion/Reveal';
import { serviceApi } from '../api/services';

const toPascalCase = (str = '') => str.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');

export default function ServiceDetails() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    serviceApi
      .getOne(slug)
      .then((res) => setService(res.data.service))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="section-pad"><Loader /></div>;
  if (error || !service) return <div className="section-pad"><ErrorState message="This service could not be found." /></div>;

  const Icon = Icons[toPascalCase(service.icon)] || Icons.Stethoscope;

  return (
    <section className="section-pad">
      <div className="container-lp grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {service.image?.url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden mb-8 aspect-[16/9] bg-bone"
            >
              <img src={service.image.url} alt={service.image.altText || service.name} className="w-full h-full object-cover" />
            </motion.div>
          )}
          <Reveal>
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-paw-50 text-paw-600 mb-5">
              <Icon size={22} />
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink text-balance">{service.name}</h1>
            <p className="text-paw-600 font-semibold text-sm mt-2">{service.category}</p>
            <p className="text-ink/65 leading-relaxed mt-6 whitespace-pre-line">
              {service.fullDescription || service.shortDescription}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} as="aside" className="bg-white border border-ink/8 rounded-2xl p-7 h-fit sticky top-24">
          <h3 className="font-display font-semibold text-lg text-ink mb-4">Details</h3>
          <div className="space-y-3 text-sm">
            {service.duration && (
              <div className="flex items-center gap-2.5 text-ink/70">
                <Clock size={16} className="text-paw-500" /> {service.duration}
              </div>
            )}
            {service.price && (
              <div className="flex items-center gap-2.5 text-ink/70">
                <IndianRupee size={16} className="text-paw-500" /> {service.priceLabel ? `${service.priceLabel} ` : ''}₹{service.price}
              </div>
            )}
            {!service.duration && !service.price && (
              <p className="text-ink/50">Contact us for pricing and duration details.</p>
            )}
          </div>
          <Link to="/appointments" data-cursor="Book" className="btn-primary w-full mt-6">
            Book Appointment <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
