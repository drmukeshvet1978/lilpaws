import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import * as Icons from 'lucide-react';
import { Calendar, Clock, CheckCircle2, Loader2, ArrowRight, ArrowLeft, PawPrint } from 'lucide-react';
import { serviceApi, appointmentApi } from '../api/services';
import { DogMark } from './motion/PetIllustrations';

const todayStr = () => new Date().toISOString().slice(0, 10);
const toPascalCase = (str = '') => str.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');

const STEPS = [
  { id: 1, label: 'Service' },
  { id: 2, label: 'Date' },
  { id: 3, label: 'Time' },
  { id: 4, label: 'Your Pet' },
  { id: 5, label: 'Confirm' },
];

export default function AppointmentForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    ownerName: '',
    phone: '',
    email: '',
    petName: '',
    petType: '',
    petBreed: '',
    petAge: '',
    serviceId: '',
    reason: '',
    date: '',
    timeSlot: '',
    message: '',
  });
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    serviceApi
      .getAll()
      .then((res) => setServices(res.data.services))
      .catch(() => toast.error('Could not load services right now.'));
  }, []);

  useEffect(() => {
    if (!form.date) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    setSlotsMessage('');
    appointmentApi
      .getAvailability(form.date)
      .then((res) => {
        setSlots(res.data.slots || []);
        if (!res.data.available) setSlotsMessage(res.data.reason || 'No slots available.');
      })
      .catch(() => setSlotsMessage('Could not check availability. Please try another date.'))
      .finally(() => setSlotsLoading(false));
  }, [form.date]);

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const fieldsForStep = {
    1: ['serviceId'],
    2: ['date'],
    3: ['timeSlot'],
    4: ['ownerName', 'phone', 'petName', 'petType', 'reason'],
    5: [],
  };

  const validateStep = (s) => {
    const req = fieldsForStep[s];
    const newErrors = {};
    req.forEach((f) => {
      if (!form[f] || !String(form[f]).trim()) newErrors[f] = 'Required';
    });
    if (s === 4) {
      if (form.phone && !/^[0-9+\-\s()]{7,15}$/.test(form.phone)) newErrors.phone = 'Enter a valid phone number';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) {
      toast.error('Please fill in the required details.');
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setDirection(1);
      setStep(4);
      toast.error('Please fill in all required fields correctly.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await appointmentApi.create(form);
      setConfirmed(res.data.appointment);
      toast.success('Appointment requested!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not book this slot. Please try another.');
      if (err.response?.status === 409 && form.date) {
        appointmentApi.getAvailability(form.date).then((r) => setSlots(r.data.slots || []));
        update('timeSlot', '');
        setDirection(-1);
        setStep(3);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = services.find((s) => s._id === form.serviceId);

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white border border-ink/8 rounded-2xl p-8 sm:p-10 text-center max-w-xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 16 }}
          className="w-20 h-20 mx-auto mb-5"
        >
          <DogMark className="w-full h-full" color="#151312" accent="#F0800E" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-paw-50 text-paw-600 mb-4">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-2xl font-display font-semibold text-ink mb-2">Appointment Requested!</h3>
          <p className="text-ink/60 mb-6">
            We've received your request. Our team will confirm it shortly by phone or WhatsApp.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-bone rounded-xl p-5 text-left text-sm space-y-2"
        >
          <Row label="Appointment ID" value={confirmed.appointmentId} />
          <Row label="Owner" value={confirmed.ownerName} />
          <Row label="Pet" value={`${confirmed.petName} (${confirmed.petType})`} />
          <Row label="Service" value={confirmed.serviceName} />
          <Row label="Date" value={confirmed.date} />
          <Row label="Time Slot" value={confirmed.timeSlot} />
          <Row label="Status" value="Pending confirmation" />
        </motion.div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          onClick={() => {
            setConfirmed(null);
            setStep(1);
            setForm({ ownerName: '', phone: '', email: '', petName: '', petType: '', petBreed: '', petAge: '', serviceId: '', reason: '', date: '', timeSlot: '', message: '' });
          }}
          className="btn-secondary mt-6"
        >
          Book Another Appointment
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-9 px-1">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: step >= s.id ? '#F0800E' : '#FFFFFF',
                  borderColor: step >= s.id ? '#F0800E' : 'rgba(21,19,18,0.15)',
                  color: step >= s.id ? '#FFFFFF' : 'rgba(21,19,18,0.4)',
                }}
                transition={{ duration: 0.3 }}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold"
              >
                {step > s.id ? <Icons.Check size={15} /> : s.id}
              </motion.div>
              <span className={`hidden sm:block text-[11px] font-semibold ${step >= s.id ? 'text-ink' : 'text-ink/35'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 bg-ink/10 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-paw-500"
                  initial={false}
                  animate={{ width: step > s.id ? '100%' : '0%' }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-ink/8 rounded-2xl p-6 sm:p-9 overflow-hidden relative min-h-[360px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && (
              <div>
                <StepHeader num="01" title="Choose a service" subtitle="What does your pet need this visit?" />
                {services.length === 0 ? (
                  <p className="text-sm text-ink/50 py-4">Loading services...</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3 mt-6">
                    {services.map((s) => {
                      const Icon = Icons[toPascalCase(s.icon)] || Icons.Stethoscope;
                      const active = form.serviceId === s._id;
                      return (
                        <button
                          key={s._id}
                          type="button"
                          onClick={() => update('serviceId', s._id)}
                          className={`text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 ${
                            active ? 'border-paw-500 bg-paw-50' : 'border-ink/10 hover:border-paw-300'
                          }`}
                        >
                          <span className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${active ? 'bg-paw-500 text-white' : 'bg-bone text-ink/60'}`}>
                            <Icon size={16} />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-ink">{s.name}</span>
                            <span className="block text-xs text-ink/50 mt-0.5">{s.category}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {errors.serviceId && <p className="text-xs text-red-600 mt-3">Please select a service</p>}
              </div>
            )}

            {step === 2 && (
              <div>
                <StepHeader num="02" title="Pick a date" subtitle="Choose a day that works for you and your pet." />
                <div className="relative mt-6 max-w-xs">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    type="date"
                    min={todayStr()}
                    value={form.date}
                    onChange={(e) => { update('date', e.target.value); update('timeSlot', ''); }}
                    className="input pl-10"
                  />
                </div>
                {errors.date && <p className="text-xs text-red-600 mt-3">Please choose a date</p>}
              </div>
            )}

            {step === 3 && (
              <div>
                <StepHeader num="03" title="Pick a time" subtitle="Here's what's available on the day you chose." />
                <div className="mt-6">
                  {slotsLoading ? (
                    <p className="text-sm text-ink/50 flex items-center gap-2 py-2.5"><Loader2 size={15} className="animate-spin" /> Checking availability...</p>
                  ) : form.date ? (
                    slots.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {slots.map((s) => (
                          <button
                            type="button"
                            key={s.slot}
                            disabled={!s.available}
                            onClick={() => update('timeSlot', s.slot)}
                            className={`px-3.5 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                              form.timeSlot === s.slot
                                ? 'bg-paw-500 border-paw-500 text-white'
                                : s.available
                                ? 'border-ink/15 hover:border-paw-500 text-ink/75'
                                : 'border-ink/5 text-ink/25 cursor-not-allowed line-through'
                            }`}
                          >
                            <Clock size={12} className="inline mr-1.5 -mt-0.5" />
                            {s.slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-ink/50 py-2">{slotsMessage || 'No slots for this date.'}</p>
                    )
                  ) : (
                    <p className="text-sm text-ink/40 py-2">Go back and pick a date first.</p>
                  )}
                </div>
                {errors.timeSlot && <p className="text-xs text-red-600 mt-3">Please choose a time slot</p>}
              </div>
            )}

            {step === 4 && (
              <div>
                <StepHeader num="04" title="Tell us about your pet" subtitle="A few details so we're ready when you arrive." />
                <div className="grid sm:grid-cols-2 gap-5 mt-6">
                  <Field label="Owner Name" error={errors.ownerName}>
                    <input value={form.ownerName} onChange={(e) => update('ownerName', e.target.value)} className="input" placeholder="Your full name" />
                  </Field>
                  <Field label="Phone Number" error={errors.phone}>
                    <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input" placeholder="10-digit mobile number" />
                  </Field>
                  <Field label="Email (optional)" error={errors.email}>
                    <input value={form.email} onChange={(e) => update('email', e.target.value)} className="input" placeholder="you@example.com" />
                  </Field>
                  <Field label="Pet Name" error={errors.petName}>
                    <input value={form.petName} onChange={(e) => update('petName', e.target.value)} className="input" placeholder="e.g. Bruno" />
                  </Field>
                  <Field label="Pet Type" error={errors.petType}>
                    <input value={form.petType} onChange={(e) => update('petType', e.target.value)} className="input" placeholder="e.g. Dog" />
                  </Field>
                  <Field label="Breed (optional)">
                    <input value={form.petBreed} onChange={(e) => update('petBreed', e.target.value)} className="input" placeholder="e.g. Labrador" />
                  </Field>
                  <Field label="Pet Age (optional)">
                    <input value={form.petAge} onChange={(e) => update('petAge', e.target.value)} className="input" placeholder="e.g. 2 years" />
                  </Field>
                </div>
                <Field label="Reason for Visit" error={errors.reason} className="mt-5">
                  <input value={form.reason} onChange={(e) => update('reason', e.target.value)} className="input" placeholder="Briefly describe the reason" />
                </Field>
                <Field label="Additional Message (optional)" className="mt-5">
                  <textarea value={form.message} onChange={(e) => update('message', e.target.value)} className="input min-h-[90px]" placeholder="Anything else we should know?" />
                </Field>
              </div>
            )}

            {step === 5 && (
              <div>
                <StepHeader num="05" title="Confirm your appointment" subtitle="Double-check the details before you send your request." />
                <div className="bg-bone rounded-xl p-5 text-sm space-y-2.5 mt-6">
                  <Row label="Service" value={selectedService?.name || '—'} />
                  <Row label="Date" value={form.date || '—'} />
                  <Row label="Time" value={form.timeSlot || '—'} />
                  <Row label="Owner" value={form.ownerName || '—'} />
                  <Row label="Phone" value={form.phone || '—'} />
                  <Row label="Pet" value={form.petName ? `${form.petName} (${form.petType})` : '—'} />
                  <Row label="Reason" value={form.reason || '—'} />
                </div>
                <p className="text-xs text-ink/45 mt-4 flex items-center gap-1.5">
                  <PawPrint size={12} /> We'll confirm this slot by phone or WhatsApp shortly after you submit.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className="btn-secondary disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowLeft size={16} /> Back
        </button>
        {step < STEPS.length ? (
          <button type="button" onClick={goNext} className="btn-primary">
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-primary disabled:opacity-60">
            {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
            {submitting ? 'Booking...' : 'Confirm Appointment Request'}
          </button>
        )}
      </div>
    </div>
  );
}

function StepHeader({ num, title, subtitle }) {
  return (
    <div>
      <span className="eyebrow">Step {num}</span>
      <h3 className="text-xl font-display font-semibold text-ink mt-2">{title}</h3>
      {subtitle && <p className="text-sm text-ink/55 mt-1">{subtitle}</p>}
    </div>
  );
}

function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-ink/80 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ink/50">{label}</span>
      <span className="font-semibold text-ink text-right">{value}</span>
    </div>
  );
}
