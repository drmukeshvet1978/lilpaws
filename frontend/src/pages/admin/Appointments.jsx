import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Search, Trash2, Eye } from 'lucide-react';
import { AdminPageHeader, Modal, Badge, FormField, useConfirm } from '../../components/admin/AdminUI';
import { Loader, EmptyState } from '../../components/States';
import { appointmentApi } from '../../api/services';

const STATUSES = ['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no-show'];
const statusTone = (s) => s;

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', date: '', search: '' });
  const [selected, setSelected] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [notes, setNotes] = useState('');
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.date) params.date = filters.date;
    if (filters.search) params.search = filters.search;
    appointmentApi.getAll(params).then((res) => setAppointments(res.data.appointments)).finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const openDetails = (appt) => {
    setSelected(appt);
    setNotes(appt.adminNotes || '');
    setRescheduleDate(appt.date);
    setRescheduleSlot(appt.timeSlot);
  };

  const updateStatus = async (status) => {
    try {
      await appointmentApi.updateStatus(selected._id, status, notes);
      toast.success(`Marked as ${status}`);
      load();
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const saveNotes = async () => {
    try {
      await appointmentApi.updateStatus(selected._id, selected.status, notes);
      toast.success('Notes saved');
      load();
    } catch (err) {
      toast.error('Could not save notes');
    }
  };

  const handleReschedule = async () => {
    try {
      await appointmentApi.reschedule(selected._id, rescheduleDate, rescheduleSlot);
      toast.success('Appointment rescheduled');
      load();
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reschedule failed');
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this appointment permanently? This cannot be undone.');
    if (!ok) return;
    try {
      await appointmentApi.delete(id);
      toast.success('Appointment deleted');
      load();
      setSelected(null);
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <AdminPageHeader title="Appointments" description="View, confirm, reschedule and manage bookings." />

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            className="input pl-10"
            placeholder="Search by name, phone, pet, or ID"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>
        <select className="input w-auto" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" className="input w-auto" value={filters.date} onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))} />
      </div>

      {loading ? (
        <Loader />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments found" description="Try adjusting your filters." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white border border-ink/8 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bone text-ink/50 text-xs uppercase">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Owner / Pet</th>
                  <th className="text-left px-5 py-3 font-semibold">Service</th>
                  <th className="text-left px-5 py-3 font-semibold">Date / Time</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/6">
                {appointments.map((a) => (
                  <tr key={a._id} className="hover:bg-bone/50">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-ink">{a.ownerName}</p>
                      <p className="text-ink/50 text-xs">{a.petName} · {a.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-ink/70">{a.serviceName}</td>
                    <td className="px-5 py-3.5 text-ink/70">{a.date}<br /><span className="text-xs text-ink/45">{a.timeSlot}</span></td>
                    <td className="px-5 py-3.5"><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => openDetails(a)} className="p-2 text-ink/50 hover:text-paw-600"><Eye size={16} /></button>
                      <button onClick={() => handleDelete(a._id)} className="p-2 text-ink/50 hover:text-red-600"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {appointments.map((a) => (
              <button key={a._id} onClick={() => openDetails(a)} className="w-full text-left bg-white border border-ink/8 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-1.5">
                  <p className="font-semibold text-ink">{a.ownerName}</p>
                  <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                </div>
                <p className="text-xs text-ink/50">{a.petName} · {a.serviceName}</p>
                <p className="text-xs text-ink/50 mt-1">{a.date} · {a.timeSlot}</p>
              </button>
            ))}
          </div>
        </>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `Appointment ${selected.appointmentId}` : ''} wide>
        {selected && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <Info label="Owner" value={selected.ownerName} />
              <Info label="Phone" value={selected.phone} />
              <Info label="Email" value={selected.email || '—'} />
              <Info label="Pet" value={`${selected.petName} (${selected.petType})`} />
              <Info label="Breed" value={selected.petBreed || '—'} />
              <Info label="Age" value={selected.petAge || '—'} />
              <Info label="Service" value={selected.serviceName} />
              <Info label="Reason" value={selected.reason} />
              <Info label="Created" value={new Date(selected.createdAt).toLocaleString()} />
              <Info label="Current Status" value={<Badge tone={statusTone(selected.status)}>{selected.status}</Badge>} />
            </div>
            {selected.message && (
              <div>
                <p className="text-xs font-semibold text-ink/50 uppercase mb-1">Message</p>
                <p className="text-sm text-ink/70">{selected.message}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t border-ink/8">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={selected.status === s}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    selected.status === s ? 'bg-ink/10 text-ink/40 border-ink/10 cursor-not-allowed' : 'border-ink/15 hover:border-paw-500 text-ink/70'
                  }`}
                >
                  Mark {s}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-ink/8">
              <FormField label="Reschedule">
                <div className="flex gap-3">
                  <input type="date" className="input" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} />
                  <input type="text" placeholder="HH:mm-HH:mm" className="input" value={rescheduleSlot} onChange={(e) => setRescheduleSlot(e.target.value)} />
                  <button onClick={handleReschedule} className="btn-secondary px-4 whitespace-nowrap">Save</button>
                </div>
              </FormField>
            </div>

            <div className="pt-2 border-t border-ink/8">
              <FormField label="Admin Notes (internal only)">
                <textarea className="input min-h-[80px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </FormField>
              <button onClick={saveNotes} className="btn-secondary mt-2 px-4 py-2 text-sm">Save Notes</button>
            </div>

            <div className="pt-3 border-t border-ink/8 flex justify-end">
              <button onClick={() => handleDelete(selected._id)} className="text-sm font-semibold text-red-600 hover:underline flex items-center gap-1.5">
                <Trash2 size={14} /> Delete Appointment
              </button>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmDialog />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-ink/45 uppercase mb-0.5">{label}</p>
      <p className="text-ink">{value}</p>
    </div>
  );
}
