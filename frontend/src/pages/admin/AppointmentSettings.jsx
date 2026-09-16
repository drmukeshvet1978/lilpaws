import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader, FormField } from '../../components/admin/AdminUI';
import { Loader } from '../../components/States';
import { appointmentSettingsApi } from '../../api/services';

export default function AdminAppointmentSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newHoliday, setNewHoliday] = useState('');
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedSlot, setNewBlockedSlot] = useState({ date: '', slot: '' });

  useEffect(() => {
    appointmentSettingsApi.get().then((res) => setSettings(res.data.settings)).finally(() => setLoading(false));
  }, []);

  const update = (field, value) => setSettings((s) => ({ ...s, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await appointmentSettingsApi.update(settings);
      setSettings(res.data.settings);
      toast.success('Appointment settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const addHoliday = () => {
    if (!newHoliday) return;
    update('holidays', [...new Set([...settings.holidays, newHoliday])]);
    setNewHoliday('');
  };
  const addBlockedDate = () => {
    if (!newBlockedDate) return;
    update('blockedDates', [...new Set([...settings.blockedDates, newBlockedDate])]);
    setNewBlockedDate('');
  };
  const addBlockedSlot = () => {
    if (!newBlockedSlot.date || !newBlockedSlot.slot) return;
    update('blockedSlots', [...settings.blockedSlots, newBlockedSlot]);
    setNewBlockedSlot({ date: '', slot: '' });
  };

  if (loading || !settings) return <Loader />;

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Appointment Settings" description="Configure slot duration, capacity, and blocked dates/slots." />

      <div className="bg-white border border-ink/8 rounded-2xl p-6 grid sm:grid-cols-2 gap-4 max-w-2xl">
        <FormField label="Slot Duration (minutes)"><input type="number" className="input" value={settings.slotDurationMinutes} onChange={(e) => update('slotDurationMinutes', Number(e.target.value))} /></FormField>
        <FormField label="Max Appointments Per Slot"><input type="number" className="input" value={settings.maxAppointmentsPerSlot} onChange={(e) => update('maxAppointmentsPerSlot', Number(e.target.value))} /></FormField>
        <FormField label="Min Advance Booking (hours)"><input type="number" className="input" value={settings.minAdvanceBookingHours} onChange={(e) => update('minAdvanceBookingHours', Number(e.target.value))} /></FormField>
        <FormField label="Max Advance Booking (days)"><input type="number" className="input" value={settings.maxAdvanceBookingDays} onChange={(e) => update('maxAdvanceBookingDays', Number(e.target.value))} /></FormField>
      </div>

      <div className="bg-white border border-ink/8 rounded-2xl p-6 max-w-2xl">
        <h3 className="font-display font-semibold text-lg mb-3">Holidays</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {settings.holidays.map((h) => (
            <span key={h} className="flex items-center gap-1.5 bg-bone px-3 py-1.5 rounded-full text-sm">
              {h} <button onClick={() => update('holidays', settings.holidays.filter((x) => x !== h))}><Trash2 size={12} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="date" className="input w-auto" value={newHoliday} onChange={(e) => setNewHoliday(e.target.value)} />
          <button onClick={addHoliday} className="btn-secondary px-4 text-sm"><Plus size={14} /> Add</button>
        </div>
      </div>

      <div className="bg-white border border-ink/8 rounded-2xl p-6 max-w-2xl">
        <h3 className="font-display font-semibold text-lg mb-3">Blocked Dates</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {settings.blockedDates.map((h) => (
            <span key={h} className="flex items-center gap-1.5 bg-bone px-3 py-1.5 rounded-full text-sm">
              {h} <button onClick={() => update('blockedDates', settings.blockedDates.filter((x) => x !== h))}><Trash2 size={12} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="date" className="input w-auto" value={newBlockedDate} onChange={(e) => setNewBlockedDate(e.target.value)} />
          <button onClick={addBlockedDate} className="btn-secondary px-4 text-sm"><Plus size={14} /> Add</button>
        </div>
      </div>

      <div className="bg-white border border-ink/8 rounded-2xl p-6 max-w-2xl">
        <h3 className="font-display font-semibold text-lg mb-3">Blocked Time Slots</h3>
        <div className="space-y-2 mb-3">
          {settings.blockedSlots.map((b, i) => (
            <div key={i} className="flex items-center justify-between bg-bone px-3 py-2 rounded-lg text-sm">
              <span>{b.date} — {b.slot}</span>
              <button onClick={() => update('blockedSlots', settings.blockedSlots.filter((_, idx) => idx !== i))}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <input type="date" className="input w-auto" value={newBlockedSlot.date} onChange={(e) => setNewBlockedSlot((s) => ({ ...s, date: e.target.value }))} />
          <input type="text" placeholder="HH:mm-HH:mm" className="input w-auto" value={newBlockedSlot.slot} onChange={(e) => setNewBlockedSlot((s) => ({ ...s, slot: e.target.value }))} />
          <button onClick={addBlockedSlot} className="btn-secondary px-4 text-sm"><Plus size={14} /> Add</button>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary px-6 py-2.5 disabled:opacity-60">{saving ? 'Saving...' : 'Save Appointment Settings'}</button>
    </div>
  );
}
