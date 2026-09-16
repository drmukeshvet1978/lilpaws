import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminPageHeader({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">{title}</h1>
        {description && <p className="text-sm text-ink/55 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, accent = false }) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? 'bg-paw-500 border-paw-500 text-white' : 'bg-white border-ink/8 text-ink'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold uppercase tracking-wide ${accent ? 'text-white/80' : 'text-ink/50'}`}>{label}</span>
        {Icon && <Icon size={16} className={accent ? 'text-white/80' : 'text-ink/40'} />}
      </div>
      <p className="text-3xl font-display font-semibold">{value}</p>
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink/8 sticky top-0 bg-white">
              <h3 className="font-display font-semibold text-lg text-ink">{title}</h3>
              <button onClick={onClose} className="p-1.5 text-ink/40 hover:text-ink"><X size={20} /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useConfirm() {
  const [state, setState] = useState({ open: false, message: '', onConfirm: null });

  const confirm = (message) =>
    new Promise((resolve) => {
      setState({ open: true, message, onConfirm: resolve });
    });

  const ConfirmDialog = () => (
    <Modal open={state.open} onClose={() => { setState((s) => ({ ...s, open: false })); state.onConfirm?.(false); }} title="Please confirm">
      <div className="flex gap-3">
        <AlertTriangle className="text-paw-500 shrink-0" size={22} />
        <p className="text-sm text-ink/70">{state.message}</p>
      </div>
      <div className="flex gap-3 mt-6 justify-end">
        <button
          onClick={() => { setState((s) => ({ ...s, open: false })); state.onConfirm?.(false); }}
          className="btn-secondary px-5 py-2"
        >
          Cancel
        </button>
        <button
          onClick={() => { setState((s) => ({ ...s, open: false })); state.onConfirm?.(true); }}
          className="btn-primary px-5 py-2"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );

  return { confirm, ConfirmDialog };
}

export function FormField({ label, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink/80 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-ink/40 mt-1">{hint}</p>}
    </div>
  );
}

export function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-ink/5 text-ink/60',
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    rescheduled: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    'no-show': 'bg-gray-200 text-gray-700',
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-500',
  };
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${tones[tone] || tones.default}`}>{children}</span>;
}
