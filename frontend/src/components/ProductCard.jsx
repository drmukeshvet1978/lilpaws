import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import useSiteSettings from '../hooks/useSiteSettings';

export default function ProductCard({ product, index = 0 }) {
  const { settings } = useSiteSettings();
  const image = product.images?.[0]?.url;
  const digits = settings?.whatsapp?.replace(/[^0-9]/g, '');
  const enquireLink = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(`Hi, I'd like to know more about "${product.name}" from Lil Paws Pet Shop.`)}`
    : '/contact';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white border border-ink/8 rounded-2xl overflow-hidden hover:shadow-soft hover:border-paw-400 transition-all duration-300"
    >
      <div className="aspect-square bg-bone flex items-center justify-center overflow-hidden relative">
        {image ? (
          <img src={image} alt={product.images[0].altText || product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
        ) : (
          <PawPrint className="text-ink/15" size={40} />
        )}
        {product.isFeatured && (
          <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wide text-white bg-paw-500 px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-ink text-base">{product.name}</h3>
        {product.description && <p className="text-sm text-ink/55 mt-1 line-clamp-2">{product.description}</p>}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm font-semibold text-ink">
            {product.price ? `₹${product.price}` : 'Price on enquiry'}
          </span>
          <a href={enquireLink} target="_blank" rel="noreferrer" data-cursor="Chat" className="text-sm font-semibold text-paw-600 hover:underline">
            Enquire Now
          </a>
        </div>
        {!product.isAvailable && (
          <p className="text-xs text-ink/40 mt-2">Currently unavailable</p>
        )}
      </div>
    </motion.div>
  );
}
