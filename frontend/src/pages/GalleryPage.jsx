import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import Gallery from '../components/Gallery';
import { Loader, EmptyState } from '../components/States';
import { galleryApi } from '../api/services';

const CATEGORIES = ['All', 'Clinic', 'Pets', 'Team', 'Events', 'Products', 'Other'];

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    galleryApi.getAll().then((res) => setImages(res.data.images)).finally(() => setLoading(false));
  }, []);

  const filtered = category === 'All' ? images : images.filter((i) => i.category === category);

  return (
    <section className="section-pad">
      <div className="container-lp">
        <SectionHeading eyebrow="Gallery" title="A look inside Lil Paws" align="center" />

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
                <motion.span layoutId="gallery-pill" className="absolute inset-0 bg-ink rounded-full -z-10" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
              )}
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {loading ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <EmptyState title="No photos yet" description="Our gallery is being updated. Please check back soon." />
          ) : (
            <Gallery key={category} images={filtered} />
          )}
        </div>
      </div>
    </section>
  );
}
