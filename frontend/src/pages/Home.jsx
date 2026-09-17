import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import ProductCard from '../components/ProductCard';
import TestimonialCard from '../components/TestimonialCard';
import FAQAccordion from '../components/FAQAccordion';
import HomeGallery from '../components/HomeGallery';
import { Loader } from '../components/States';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal';
import MagneticButton from '../components/motion/MagneticButton';
import { CatMark, PawMark } from '../components/motion/PetIllustrations';
import { homepageApi, serviceApi, testimonialApi, faqApi, aboutApi, productApi, galleryApi } from '../api/services';

const toPascalCase = (str = '') => str.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');

export default function Home() {
  const [content, setContent] = useState(null);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      homepageApi.get(),
      serviceApi.getAll(),
      productApi.getAll(),
      testimonialApi.getAll(),
      faqApi.getAll(),
      aboutApi.get(),
      galleryApi.getAll({ featured: true }),
    ])
      .then(([h, s, p, t, f, a, g]) => {
        setContent(h.data.content);
        setServices(s.data.services.slice(0, 6));
        // featured items shelved first, then fill the rest of the shelf with
        // whatever's in stock — keeps the strip full even before anything
        // is marked "featured" in the admin panel
        const available = (p.data.products || []).filter((prod) => prod.isAvailable !== false);
        const featured = available.filter((prod) => prod.isFeatured);
        const rest = available.filter((prod) => !prod.isFeatured);
        setProducts([...featured, ...rest].slice(0, 8));
        setTestimonials(t.data.testimonials.slice(0, 3));
        setFaqs(f.data.faqs.slice(0, 5));
        // only admin-marked "featured" gallery photos show up here — the rest
        // of the album stays on the dedicated Gallery page
        setGalleryImages(g.data.images || []);
        setDoctor(a.data.profile);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="section-pad"><Loader label="Loading Lil Paws..." /></div>;

  const quickInfo = content?.quickInfo?.filter((q) => q.isActive) || [];
  const whyChooseUs = content?.whyChooseUs?.filter((w) => w.isActive) || [];

  return (
    <>
      <Hero hero={content?.hero} />

      {/* Quick info — scrolling brand strip */}
      {quickInfo.length > 0 && (
        <section className="relative border-y border-ink/8 bg-ink overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-5">
            {[...Array(2)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex items-center shrink-0">
                {quickInfo.map((q, i) => {
                  const Icon = Icons[toPascalCase(q.icon)] || Icons.HeartPulse;
                  return (
                    <div key={`${loopIdx}-${i}`} className="flex items-center gap-3 px-8">
                      <Icon size={20} className="text-paw-400 shrink-0" />
                      <span className="font-display text-lg text-cream/90">{q.title}</span>
                      <span className="text-cream/20 text-lg">•</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About preview — editorial */}
      <section className="section-pad relative overflow-hidden">
        <div className="container-lp grid lg:grid-cols-2 gap-14 items-center">
          <Reveal y={30} className="relative order-2 lg:order-1">
            <div className="relative rounded-paw overflow-hidden bg-bone aspect-[4/5] max-w-md shadow-soft">
              {doctor?.photo?.url ? (
                <img src={doctor.photo.url} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink/20">
                  <Icons.PawPrint size={64} />
                </div>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 180, damping: 16 }}
              className="hidden sm:flex absolute -top-6 -right-6 w-20 h-20 rounded-full bg-paw-500 items-center justify-center shadow-soft animate-float-slow"
            >
              <PawMark className="w-8 h-8 text-white" />
            </motion.div>
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="About Lil Paws"
              title={doctor?.name ? `Led by ${doctor.name}` : 'A clinic built around pet-first care'}
            />
            <Reveal delay={0.2}>
              <p className="mt-5 text-ink/65 leading-relaxed">
                {doctor?.aboutText || 'Lil Paws Dog Clinic & Pet Shop brings together veterinary care and everyday pet essentials across our Minal and Kolar Road locations in Bhopal.'}
              </p>
              <Link to="/about" className="btn-ghost mt-6 inline-flex items-center gap-1.5">
                Read our story <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services — interactive numbered grid */}
      {services.length > 0 && (
        <section className="section-pad bg-white bg-grain">
          <div className="container-lp relative">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <SectionHeading eyebrow="What we offer" title="Care for your dog, all in one place" />
              <Link to="/services" className="btn-ghost hidden sm:inline-flex items-center gap-1.5">
                View all services <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s, i) => <ServiceCard key={s._id} service={s} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Pet Shop — horizontal shelf, deliberately different rhythm from
          the numbered services grid above so the two offerings (care vs.
          shopping) read as distinct without feeling disconnected */}
      {products.length > 0 && (
        <section className="section-pad bg-bone relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 bg-paw-print opacity-[0.04]" />
          <div className="container-lp relative">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <SectionHeading eyebrow="From the Pet Shop" title="Everyday essentials, ready to grab" />
              <Link to="/pet-shop" className="btn-ghost hidden sm:inline-flex items-center gap-1.5">
                Visit the shop <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="container-lp">
              <div className="flex gap-5 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory scrollbar-none">
                {products.map((p, i) => (
                  <div key={p._id} className="shrink-0 w-[72vw] xs:w-64 sm:w-72 snap-start">
                    <ProductCard product={p} index={i} />
                  </div>
                ))}
                {/* trailing "see everything" card, same shelf, same scroll */}
                <Link
                  to="/pet-shop"
                  data-cursor="Shop"
                  className="shrink-0 w-[72vw] xs:w-64 sm:w-72 snap-start rounded-2xl border-2 border-dashed border-ink/15 hover:border-paw-500 flex flex-col items-center justify-center gap-3 text-center p-8 transition-colors group"
                >
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-paw-600 group-hover:bg-paw-500 group-hover:text-white transition-colors shadow-soft">
                    <ArrowRight size={20} />
                  </span>
                  <span className="font-display font-semibold text-ink">See the full shop</span>
                  <span className="text-sm text-ink/55">Food, toys, grooming &amp; more</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="container-lp mt-2 sm:hidden">
            <Link to="/pet-shop" className="btn-ghost inline-flex items-center gap-1.5">
              Visit the shop <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* Why choose us */}
      {whyChooseUs.length > 0 && (
        <section className="section-pad relative overflow-hidden">
          <div aria-hidden="true" className="hidden lg:block absolute top-10 right-10 w-24 h-24 opacity-70 animate-float">
            <CatMark className="w-full h-full" color="#7E3D0B" accent="#F0800E" />
          </div>
          <div className="container-lp">
            <SectionHeading eyebrow="Why choose us" title="Why pet parents pick Lil Paws" align="center" />
            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {whyChooseUs.map((w, i) => {
                const Icon = Icons[toPascalCase(w.icon)] || Icons.ShieldCheck;
                return (
                  <StaggerItem key={i}>
                    <div className="bg-white border border-ink/8 rounded-2xl p-6 h-full hover:border-paw-400 hover:-translate-y-1 transition-all duration-300">
                      <Icon size={22} className="text-paw-500 mb-3" />
                      <p className="font-semibold text-ink mb-1">{w.title}</p>
                      <p className="text-sm text-ink/55">{w.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-lp">
            <SectionHeading eyebrow="Testimonials" title="What pet parents say" align="center" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {testimonials.map((t, i) => <TestimonialCard key={t._id} testimonial={t} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Gallery — curated highlights only; admin marks which photos show up
          here from the full Gallery page, everything else stays off the
          homepage on purpose */}
      <HomeGallery images={galleryImages} />

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="section-pad">
          <div className="container-lp max-w-3xl">
            <SectionHeading eyebrow="FAQ" title="Common questions" />
            <div className="mt-10">
              <FAQAccordion faqs={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="section-pad bg-paw-500 relative overflow-hidden">
        <div aria-hidden="true" className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-white/10" />
        <div aria-hidden="true" className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-ink/10" />
        <div className="container-lp text-center relative">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white text-balance">
              Ready to bring your pet in?
            </h2>
            <p className="text-white/80 mt-3 max-w-lg mx-auto">
              Book an appointment in a couple of minutes — we'll confirm it shortly after.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-7 inline-block">
            <MagneticButton>
              <Link to="/appointments" data-cursor="Book" className="inline-flex items-center gap-2 bg-ink text-cream font-semibold px-6 py-3.5 rounded-full hover:bg-ink/85 transition-colors">
                Book an Appointment <ArrowUpRight size={16} />
              </Link>
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}