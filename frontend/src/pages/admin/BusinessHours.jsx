import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminUI';
import { Loader } from '../../components/States';
import { businessHoursApi } from '../../api/services';

export default function AdminBusinessHours() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    businessHoursApi.get().then((res) => setSchedule(res.data.hours.weeklySchedule)).finally(() => setLoading(false));
  }, []);

  const updateDay = (idx, field, value) => {
    setSchedule((s) => { const copy = [...s]; copy[idx] = { ...copy[idx], [field]: value }; return copy; });
  };

  const addBreak = (idx) => {
    setSchedule((s) => { const copy = [...s]; copy[idx] = { ...copy[idx], breaks: [...(copy[idx].breaks || []), { start: '14:00', end: '15:00' }] }; return copy; });
  };
  const updateBreak = (dayIdx, breakIdx, field, value) => {
    setSchedule((s) => {
      const copy = [...s];
      const breaks = [...copy[dayIdx].breaks];
      breaks[breakIdx] = { ...breaks[breakIdx], [field]: value };
      copy[dayIdx] = { ...copy[dayIdx], breaks };
      return copy;
    });
  };
  const removeBreak = (dayIdx, breakIdx) => {
    setSchedule((s) => { const copy = [...s]; copy[dayIdx] = { ...copy[dayIdx], breaks: copy[dayIdx].breaks.filter((_, i) => i !== breakIdx) }; return copy; });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await businessHoursApi.update(schedule);
      toast.success('Business hours saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !schedule) return <Loader />;

  return (
    <div>
      <AdminPageHeader title="Business Hours" description="Set weekly opening hours and daily breaks. This directly controls appointment availability." />

      <div className="bg-white border border-ink/8 rounded-2xl divide-y divide-ink/6">
        {schedule.map((day, idx) => (
          <div key={day.day} className="p-5">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 font-semibold text-ink w-32">
                <input type="checkbox" checked={day.isOpen} onChange={(e) => updateDay(idx, 'isOpen', e.target.checked)} />
                {day.day}
              </label>
              {day.isOpen && (
                <>
                  <input type="time" className="input w-auto" value={day.openTime} onChange={(e) => updateDay(idx, 'openTime', e.target.value)} />
                  <span className="text-ink/40">to</span>
                  <input type="time" className="input w-auto" value={day.closeTime} onChange={(e) => updateDay(idx, 'closeTime', e.target.value)} />
                </>
              )}
            </div>
            {day.isOpen && (
              <div className="mt-3 ml-0 sm:ml-36 space-y-2">
                {(day.breaks || []).map((b, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-3">
                    <span className="text-xs text-ink/50 w-14">Break</span>
                    <input type="time" className="input w-auto" value={b.start} onChange={(e) => updateBreak(idx, bIdx, 'start', e.target.value)} />
                    <span className="text-ink/40 text-sm">to</span>
                    <input type="time" className="input w-auto" value={b.end} onChange={(e) => updateBreak(idx, bIdx, 'end', e.target.value)} />
                    <button onClick={() => removeBreak(idx, bIdx)} className="p-1.5 text-ink/40 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                ))}
                <button onClick={() => addBreak(idx)} className="text-xs font-semibold text-paw-600 flex items-center gap-1 ml-14"><Plus size={12} /> Add break</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary px-6 py-2.5 mt-5 disabled:opacity-60">{saving ? 'Saving...' : 'Save Business Hours'}</button>
    </div>
  );
}
