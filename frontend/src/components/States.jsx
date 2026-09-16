import { Inbox, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PawMark } from './motion/PetIllustrations';

export function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-ink/50 gap-3">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          >
            <PawMark className="w-4 h-4 text-paw-500" />
          </motion.span>
        ))}
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', description, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-2 text-ink/60">
      <Icon size={32} className="text-ink/30 mb-1" />
      <p className="font-semibold text-ink/80">{title}</p>
      {description && <p className="text-sm max-w-sm">{description}</p>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong. Please try again.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-2 text-ink/60">
      <AlertTriangle size={32} className="text-paw-500 mb-1" />
      <p>{message}</p>
    </div>
  );
}
