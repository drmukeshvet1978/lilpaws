import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DogMark } from '../components/motion/PetIllustrations';

export default function NotFound() {
  return (
    <section className="section-pad">
      <div className="container-lp text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-24 h-24 mx-auto mb-5"
        >
          <DogMark className="w-full h-full" color="#7E3D0B" accent="#F0800E" />
        </motion.div>
        <h1 className="text-3xl font-display font-semibold text-ink">Page not found</h1>
        <p className="text-ink/60 mt-3">This page may have wandered off. Let's get you back home.</p>
        <Link to="/" className="btn-primary mt-7 inline-flex">Back to Home</Link>
      </div>
    </section>
  );
}
