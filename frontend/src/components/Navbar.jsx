import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import useSiteSettings from '../hooks/useSiteSettings';
import MagneticButton from './motion/MagneticButton';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/pet-shop', label: 'Pet Shop' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSiteSettings();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
        <div className="container-lp pointer-events-auto">
          <motion.div
            animate={{
              marginTop: scrolled ? 14 : 0,
              paddingLeft: scrolled ? 18 : 0,
              paddingRight: scrolled ? 10 : 0,
              borderRadius: scrolled ? 999 : 0,
              boxShadow: scrolled ? '0 14px 40px -18px rgba(21,19,18,0.28)' : '0 0 0 rgba(0,0,0,0)',
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`flex items-center justify-between py-2.5 transition-colors duration-300 ${
              scrolled ? 'bg-cream/90 backdrop-blur-md border border-ink/8' : 'bg-transparent'
            }`}
          >
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src={logo} alt="Lil Paws Dog Clinic & Pet Shop" className="h-11 w-auto object-contain" />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `relative py-1.5 text-sm font-semibold tracking-wide transition-colors ${
                      isActive ? 'text-paw-600' : 'text-ink/80 hover:text-paw-600'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-paw-500 rounded-full"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="p-2.5 rounded-full border border-ink/15 hover:border-paw-500 hover:text-paw-600 transition-colors"
                  aria-label="Call Lil Paws"
                  data-cursor="Call"
                >
                  <Phone size={17} />
                </a>
              )}
              <MagneticButton>
                <Link to="/appointments" className="btn-primary" data-cursor="Book">
                  Book Appointment <ArrowRight size={16} />
                </Link>
              </MagneticButton>
            </div>

            <button
              className="lg:hidden relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <motion.span
                animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
                className="block w-6 h-[2px] bg-ink rounded-full origin-center"
              />
              <motion.span
                animate={{ opacity: open ? 0 : 1 }}
                className="block w-6 h-[2px] bg-ink rounded-full"
              />
              <motion.span
                animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
                className="block w-6 h-[2px] bg-ink rounded-full origin-center"
              />
            </button>
          </motion.div>
        </div>
      </header>

      {/* spacer so content doesn't sit under the fixed navbar */}
      <div className="h-[76px]" />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden bg-ink text-cream"
          >
            <div className="container-lp h-full flex flex-col justify-center py-24">
              <nav className="flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block py-3 text-4xl sm:text-5xl font-display font-semibold border-b border-cream/10 ${
                          isActive ? 'text-paw-400' : 'text-cream/90'
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <Link to="/appointments" onClick={() => setOpen(false)} className="btn-primary">
                  Book Appointment <ArrowRight size={16} />
                </Link>
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="text-cream/70 font-semibold text-sm flex items-center gap-2">
                    <Phone size={15} /> {settings.phone}
                  </a>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
