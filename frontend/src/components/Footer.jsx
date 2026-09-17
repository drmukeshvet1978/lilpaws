import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowUpRight } from 'lucide-react';
import logo from '../assets/logo.png';
import useSiteSettings from '../hooks/useSiteSettings';
import { Reveal } from './motion/Reveal';
import MagneticButton from './motion/MagneticButton';

export default function Footer() {
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink text-cream overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-paw-print opacity-[0.06]" />

      <div className="container-lp pt-16 sm:pt-24 pb-10 relative">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 items-end">
          <Reveal>
            <p className="eyebrow text-paw-400 mb-4">Ready to visit?</p>
            <h2 className="font-display font-semibold text-cream leading-[0.92] text-[15vw] sm:text-7xl lg:text-8xl text-balance">
              Lil Paws
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col sm:items-end gap-4">
            <p className="text-cream/60 max-w-xs sm:text-right">
              {settings?.footerDescription ||
                'Veterinary care and pet essentials, across our Minal and Kolar Road locations in Bhopal — by Dr. Mukesh Tiwari.'}
            </p>
            <MagneticButton>
              <Link to="/appointments" className="btn-primary" data-cursor="Book">
                Book an Appointment <ArrowUpRight size={16} />
              </Link>
            </MagneticButton>
          </Reveal>
        </div>

        <div className="h-px bg-cream/10 mt-10 mb-6" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pt-4">
          <div className="col-span-2 md:col-span-1">
            <img src={logo} alt="Lil Paws" className="h-12 w-auto object-contain bg-cream rounded-xl p-1.5 mb-4" />
            <div className="flex gap-3">
              {settings?.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="p-2 rounded-full border border-cream/20 hover:border-paw-500 hover:text-paw-400 transition-colors" data-cursor="Visit">
                  <Facebook size={16} />
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-full border border-cream/20 hover:border-paw-500 hover:text-paw-400 transition-colors" data-cursor="Visit">
                  <Instagram size={16} />
                </a>
              )}
              {settings?.socialLinks?.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="p-2 rounded-full border border-cream/20 hover:border-paw-500 hover:text-paw-400 transition-colors" data-cursor="Visit">
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-display text-base mb-4 text-cream/90">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-cream/60">
              <li><Link to="/about" className="hover:text-paw-400 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-paw-400 transition-colors">Services</Link></li>
              <li><Link to="/pet-shop" className="hover:text-paw-400 transition-colors">Pet Shop</Link></li>
              <li><Link to="/gallery" className="hover:text-paw-400 transition-colors">Gallery</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2">
            <h4 className="font-display text-base mb-4 text-cream/90">Contact</h4>
            <ul className="space-y-3 text-sm text-cream/60">
              <li className="flex gap-2.5">
                <MapPin size={16} className="shrink-0 mt-0.5 text-paw-400" />
                <span>{settings?.address || 'Minal & Kolar Road, Bhopal, Madhya Pradesh, India'}</span>
              </li>
              {settings?.phone && (
                <li className="flex gap-2.5 items-center">
                  <Phone size={16} className="shrink-0 text-paw-400" />
                  <a href={`tel:${settings.phone}`} className="hover:text-paw-400 transition-colors">{settings.phone}</a>
                </li>
              )}
              {settings?.email && (
                <li className="flex gap-2.5 items-center">
                  <Mail size={16} className="shrink-0 text-paw-400" />
                  <a href={`mailto:${settings.email}`} className="hover:text-paw-400 transition-colors">{settings.email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 relative">
        <div className="container-lp py-5 text-xs text-cream/45 flex flex-col sm:flex-row gap-2 justify-between">
          <p>© {year} Lil Paws Dog Clinic & Pet Shop. All rights reserved.</p>
          <p>Dog Clinic by Dr. Mukesh Tiwari — Minal & Kolar Road, Bhopal</p>
        </div>
      </div>
    </footer>
  );
}