import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useSiteSettings from '../hooks/useSiteSettings';

export default function WhatsAppButton() {
  const { settings } = useSiteSettings();
  if (!settings?.whatsapp) return null;

  const digits = settings.whatsapp.replace(/[^0-9]/g, '');

  return (
    <motion.a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      data-cursor="Chat"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-5 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-soft"
    >
      <MessageCircle size={24} fill="white" strokeWidth={0} />
    </motion.a>
  );
}
