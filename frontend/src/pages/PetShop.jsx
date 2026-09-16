import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import { Loader, EmptyState } from '../components/States';
import { productApi } from '../api/services';

const CATEGORIES = ['All', 'Pet Food', 'Accessories', 'Toys', 'Grooming Products', 'Pet Care Products', 'Other'];

export default function PetShop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    productApi.getAll().then((res) => setProducts(res.data.products)).finally(() => setLoading(false));
  }, []);

  const filtered = category === 'All' ? products : products.filter((p) => p.category === category);

  return (
    <section className="section-pad">
      <div className="container-lp">
        <SectionHeading eyebrow="Pet Shop" title="Everyday essentials for your pet" align="center" />

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
                <motion.span layoutId="shop-pill" className="absolute inset-0 bg-ink rounded-full -z-10" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
              )}
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {loading ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <EmptyState title="No products listed yet" description="Our pet shop catalogue is being updated. Please check back soon." />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={category}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {filtered.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
