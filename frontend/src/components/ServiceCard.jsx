import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceCard({ service, index = 0 }) {
  const Icon = Icons[toPascalCase(service.icon)] || Icons.Stethoscope;
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link
        to={`/services/${service.slug}`}
        data-cursor="View"
        className="relative flex flex-col justify-between p-7 bg-white border border-ink/8 rounded-2xl overflow-hidden hover:border-paw-400 hover:shadow-soft transition-all duration-300 min-h-[240px]"
      >
        <div
          aria-hidden="true"
          className="absolute -right-6 -top-6 text-[86px] font-display font-semibold text-ink/[0.04] group-hover:text-paw-500/[0.08] transition-colors select-none leading-none"
        >
          {num}
        </div>

        <div className="relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-paw-50 text-paw-600 mb-5 group-hover:bg-paw-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
            <Icon size={22} />
          </div>
          <p className="text-xs font-semibold text-paw-600 mb-1.5">Service {num}</p>
          <h3 className="text-lg font-display font-semibold text-ink mb-2">{service.name}</h3>
          <p className="text-sm text-ink/60 leading-relaxed">{service.shortDescription}</p>
        </div>

        <div className="relative flex items-center gap-1.5 text-sm font-semibold text-paw-600 mt-5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Learn more <ArrowUpRight size={15} />
        </div>
      </Link>
    </motion.div>
  );
}

function toPascalCase(str = '') {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}
