import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { AdminPageHeader, Modal, FormField, Badge, useConfirm } from '../../components/admin/AdminUI';
import { Loader, EmptyState } from '../../components/States';
import { testimonialApi } from '../../api/services';

const emptyForm = { customerName: '', petName: '', review: '', rating: 5, isActive: true, displayOrder: 0 };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(() => {
    setLoading(true);
    testimonialApi.getAll({ all: true }).then((res) => setItems(res.data.testimonials)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm(emptyForm); setFile(null); setModalOpen(true); };
  const openEdit = (t) => {
    setEditing(t);
    setForm({ customerName: t.customerName, petName: t.petName || '', review: t.review, rating: t.rating, isActive: t.isActive, displayOrder: t.displayOrder });
    setFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.customerName || !form.review) { toast.error('Customer name and review are required'); return; }
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('photo', file);
    try {
      if (editing) {
        await testimonialApi.update(editing._id, fd);
        toast.success('Testimonial updated');
      } else {
        await testimonialApi.create(fd);
        toast.success('Testimonial added');
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
    const ok = await confirm('Delete this testimonial?');
    if (!ok) return;
    try {
      await testimonialApi.delete(id);
      toast.success('Testimonial deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Manage customer reviews shown on the homepage."
        action={<button onClick={openNew} className="btn-primary px-5 py-2.5"><Plus size={16} /> Add Testimonial</button>}
      />

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState title="No testimonials yet" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((t) => (
            <div key={t._id} className="bg-white border border-ink/8 rounded-2xl p-5">
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} className={i < t.rating ? 'fill-paw-500 text-paw-500' : 'text-ink/15'} />)}
                </div>
                <div className="flex gap-1">
                  {t.isDemo && <Badge tone="inactive">Demo</Badge>}
                  <Badge tone={t.isActive ? 'active' : 'inactive'}>{t.isActive ? 'Live' : 'Hidden'}</Badge>
                </div>
              </div>
              <p className="text-sm text-ink/70 line-clamp-3">{t.review}</p>
              <p className="text-sm font-semibold text-ink mt-3">{t.customerName}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(t)} className="btn-secondary flex-1 py-1.5 text-xs"><Pencil size={13} /> Edit</button>
                <button onClick={() => handleDelete(t._id)} className="p-2 text-ink/50 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'}>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Customer Name"><input className="input" value={form.customerName} onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} /></FormField>
          <FormField label="Pet Name (optional)"><input className="input" value={form.petName} onChange={(e) => setForm((f) => ({ ...f, petName: e.target.value }))} /></FormField>
        </div>
        <FormField label="Review" className="mt-4"><textarea className="input min-h-[90px]" value={form.review} onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))} /></FormField>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <FormField label="Rating">
            <select className="input" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
            </select>
          </FormField>
          <FormField label="Photo (optional)"><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm" /></FormField>
        </div>
        <label className="flex items-center gap-2 mt-4 text-sm font-semibold text-ink/80">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Visible on website
        </label>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="btn-secondary px-5 py-2.5">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary px-5 py-2.5 disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </Modal>
      <ConfirmDialog />
    </div>
  );
}
