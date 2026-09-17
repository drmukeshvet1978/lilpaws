import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  MessageCircle,
  ShieldCheck,
  BadgeCheck,
  PawPrint,
  ArrowLeft,
} from 'lucide-react';
import { Loader, ErrorState } from '../components/States';
import { Reveal } from '../components/motion/Reveal';
import ProductCard from '../components/ProductCard';
import useSiteSettings from '../hooks/useSiteSettings';
import { productApi } from '../api/services';

const fmtPrice = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

function Gallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const hasImages = images.length > 0;

  const go = useCallback((dir) => {
    setActive((i) => (i + dir + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, go]);

  return (
    <div>
      <div className="relative aspect-square bg-bone rounded-3xl overflow-hidden group">
        {hasImages ? (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={images[active].url}
                alt={images[active].altText || name}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setLightbox(true)}
              />
            </AnimatePresence>

            <button
              onClick={() => setLightbox(true)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-ink shadow-soft opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Zoom image"
            >
              <ZoomIn size={17} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-ink shadow-soft opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => go(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-ink shadow-soft opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
                <span className="absolute bottom-4 right-4 text-[11px] font-semibold text-white bg-ink/60 backdrop-blur px-2.5 py-1 rounded-full">
                  {active + 1} / {images.length}
                </span>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PawPrint className="text-ink/15" size={56} />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar pb-1">
          {images.map((img, i) => (
            <button
              key={img.publicId || i}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                active === i ? 'border-paw-500' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={img.altText || `${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && hasImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4 sm:p-10"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); go(-1); }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); go(1); }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <motion.img
              key={active}
              src={images[active].url}
              alt={images[active].altText || name}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const { settings } = useSiteSettings();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setProduct(null);
    productApi
      .getOne(slug)
      .then((res) => setProduct(res.data.product))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    productApi
      .getAll({ category: product.category })
      .then((res) => setRelated(res.data.products.filter((p) => p._id !== product._id).slice(0, 4)))
      .catch(() => setRelated([]));
  }, [product]);

  if (loading) return <div className="section-pad"><Loader /></div>;
  if (error || !product) {
    return (
      <div className="section-pad">
        <ErrorState message="This product could not be found." />
        <div className="text-center mt-4">
          <Link to="/pet-shop" className="btn-ghost">Back to Pet Shop</Link>
        </div>
      </div>
    );
  }

  const digits = settings?.whatsapp?.replace(/[^0-9]/g, '');
  const enquireLink = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(`Hi, I'd like to know more about "${product.name}" from Lil Paws Pet Shop.`)}`
    : '/contact';

  return (
    <section className="section-pad">
      <div className="container-lp">
        {/* Breadcrumb */}
        <Reveal y={10}>
          <nav className="flex items-center gap-2 text-sm text-ink/50 mb-8 flex-wrap">
            <Link to="/pet-shop" className="hover:text-paw-600 transition-colors inline-flex items-center gap-1.5">
              <ArrowLeft size={14} /> Pet Shop
            </Link>
            <span>/</span>
            <span className="text-ink/70">{product.category}</span>
            <span>/</span>
            <span className="text-ink font-semibold truncate max-w-[200px]">{product.name}</span>
          </nav>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <Reveal>
            <Gallery images={product.images || []} name={product.name} />
          </Reveal>

          {/* Info */}
          <Reveal delay={0.1}>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="eyebrow bg-paw-50 px-3 py-1 rounded-full">{product.category}</span>
              {product.isFeatured && (
                <span className="text-[11px] font-bold uppercase tracking-wide text-white bg-ink px-2.5 py-1 rounded-full">
                  Featured
                </span>
              )}
              {!product.isAvailable && (
                <span className="text-[11px] font-bold uppercase tracking-wide text-paw-700 bg-paw-100 px-2.5 py-1 rounded-full">
                  Out of stock
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink text-balance leading-tight">
              {product.name}
            </h1>

            <p className="text-2xl font-display font-semibold text-paw-600 mt-4">
              {product.price ? fmtPrice(product.price) : 'Price on enquiry'}
            </p>

            {product.description && (
              <p className="text-ink/65 leading-relaxed mt-6 whitespace-pre-line">{product.description}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a
                href={enquireLink}
                target="_blank"
                rel="noreferrer"
                data-cursor="Chat"
                className="btn-primary flex-1"
              >
                <MessageCircle size={17} /> Enquire on WhatsApp
              </a>
              <Link to="/pet-shop" className="btn-secondary flex-1">
                Continue Browsing
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-8 pt-8 border-t border-ink/8">
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-full bg-paw-50 text-paw-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Curated by our vet team</p>
                  <p className="text-xs text-ink/50 mt-0.5">Picked for quality and everyday reliability</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-full bg-paw-50 text-paw-600 flex items-center justify-center shrink-0">
                  <BadgeCheck size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Personal WhatsApp support</p>
                  <p className="text-xs text-ink/50 mt-0.5">Ask us anything before you decide</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-24">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-ink text-balance">
                You may also like
              </h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}