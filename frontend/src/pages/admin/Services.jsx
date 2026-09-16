import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { AdminPageHeader, Modal, FormField, Badge, useConfirm } from '../../components/admin/AdminUI';
import { Loader, EmptyState } from '../../components/States';
import { serviceApi } from '../../api/services';

const CATEGORIES = ['Veterinary Consultation', 'General Pet Care', 'Preventive Care', 'Diagnostics', 'Vaccination', 'Grooming / Hygiene', 'Other'];
const emptyForm = { name: '', shortDescription: '', fullDescription: '', icon: 'stethoscope', category: 'Other', price: '', priceLabel: '', duration: '', isActive: true, displayOrder: 0 };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(() => {
    setLoading(true);
    serviceApi.getAll({ all: true }).then((res) => setServices(res.data.services)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm(emptyForm); setFile(null); setModalOpen(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, shortDescription: s.shortDescription, fullDescription: s.fullDescription || '', icon: s.icon, category: s.category, price: s.price || '', priceLabel: s.priceLabel || '', duration: s.duration || '', isActive: s.isActive, displayOrder: s.displayOrder });
    setFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.shortDescription) {
      toast.error('Name and short description are required');
      return;
    }
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    try {
      if (editing) {
        await serviceApi.update(editing._id, fd);
        toast.success('Service updated');
      } else {
        await serviceApi.create(fd);
        toast.success('Service created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this service? This cannot be undone.');
    if (!ok) return;
    try {
      await serviceApi.delete(id);
      toast.success('Service deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const toggleActive = async (s) => {
    const fd = new FormData();
    fd.append('isActive', !s.isActive);
    await serviceApi.update(s._id, fd);
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Manage the veterinary and pet-care services shown on the website."
        action={<button onClick={openNew} className="btn-primary px-5 py-2.5"><Plus size={16} /> Add Service</button>}
      />

      {loading ? (
        <Loader />
      ) : services.length === 0 ? (
        <EmptyState title="No services yet" description="Add your first service to get started." />
      ) : (
        <div className="bg-white border border-ink/8 rounded-2xl divide-y divide-ink/6">
          {services.sort((a, b) => a.displayOrder - b.displayOrder).map((s) => (
            <div key={s._id} className="flex items-center gap-4 px-5 py-4">
              <GripVertical size={16} className="text-ink/20 hidden sm:block" />
              <div className="w-12 h-12 rounded-xl bg-bone overflow-hidden shrink-0">
                {s.image?.url && <img src={s.image.url} alt={s.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink truncate">{s.name}</p>
                <p className="text-xs text-ink/50 truncate">{s.category}</p>
              </div>
              <button onClick={() => toggleActive(s)}>
                <Badge tone={s.isActive ? 'active' : 'inactive'}>{s.isActive ? 'Active' : 'Inactive'}</Badge>
              </button>
              <button onClick={() => openEdit(s)} className="p-2 text-ink/50 hover:text-paw-600"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(s._id)} className="p-2 text-ink/50 hover:text-red-600"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'} wide>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Name"><input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></FormField>
          <FormField label="Category">
            <select className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
        </div>
        <FormField label="Short Description" className="mt-4">
          <input className="input" value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} />
        </FormField>
        <FormField label="Full Description" hint="Shown on the service detail page." >
          <textarea className="input min-h-[100px] mt-4" value={form.fullDescription} onChange={(e) => setForm((f) => ({ ...f, fullDescription: e.target.value }))} />
        </FormField>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <FormField label="Price (optional)"><input type="number" className="input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></FormField>
          <FormField label="Price Label"><input className="input" placeholder="e.g. Starting from" value={form.priceLabel} onChange={(e) => setForm((f) => ({ ...f, priceLabel: e.target.value }))} /></FormField>
          <FormField label="Duration"><input className="input" placeholder="e.g. 30 mins" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} /></FormField>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <FormField label="Icon" hint="lucide-react icon name, e.g. stethoscope, heart-pulse, syringe">
            <input className="input" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
          </FormField>
          <FormField label="Display Order"><input type="number" className="input" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))} /></FormField>
        </div>
        <FormField label="Image" className="mt-4">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
        </FormField>
        <label className="flex items-center gap-2 mt-4 text-sm font-semibold text-ink/80">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active (visible on website)
        </label>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="btn-secondary px-5 py-2.5">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary px-5 py-2.5 disabled:opacity-60">{saving ? 'Saving...' : 'Save Service'}</button>
        </div>
      </Modal>
      <ConfirmDialog />
    </div>
  );
}
