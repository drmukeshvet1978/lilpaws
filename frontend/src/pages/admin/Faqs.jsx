import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminPageHeader, Modal, FormField, Badge, useConfirm } from '../../components/admin/AdminUI';
import { Loader, EmptyState } from '../../components/States';
import { faqApi } from '../../api/services';

const emptyForm = { question: '', answer: '', isActive: true, displayOrder: 0 };

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(() => {
    setLoading(true);
    faqApi.getAll({ all: true }).then((res) => setFaqs(res.data.faqs)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (f) => { setEditing(f); setForm({ question: f.question, answer: f.answer, isActive: f.isActive, displayOrder: f.displayOrder }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.question || !form.answer) { toast.error('Question and answer are required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await faqApi.update(editing._id, form);
        toast.success('FAQ updated');
      } else {
        await faqApi.create(form);
        toast.success('FAQ added');
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
    const ok = await confirm('Delete this FAQ?');
    if (!ok) return;
    try {
      await faqApi.delete(id);
      toast.success('FAQ deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const toggleActive = async (f) => {
    await faqApi.update(f._id, { isActive: !f.isActive });
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="FAQs"
        description="Manage frequently asked questions shown on the homepage."
        action={<button onClick={openNew} className="btn-primary px-5 py-2.5"><Plus size={16} /> Add FAQ</button>}
      />

      {loading ? (
        <Loader />
      ) : faqs.length === 0 ? (
        <EmptyState title="No FAQs yet" />
      ) : (
        <div className="bg-white border border-ink/8 rounded-2xl divide-y divide-ink/6">
          {faqs.sort((a, b) => a.displayOrder - b.displayOrder).map((f) => (
            <div key={f._id} className="flex items-start gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink">{f.question}</p>
                <p className="text-sm text-ink/50 mt-1 line-clamp-2">{f.answer}</p>
              </div>
              <button onClick={() => toggleActive(f)} className="shrink-0">
                <Badge tone={f.isActive ? 'active' : 'inactive'}>{f.isActive ? 'Active' : 'Inactive'}</Badge>
              </button>
              <button onClick={() => openEdit(f)} className="p-2 text-ink/50 hover:text-paw-600 shrink-0"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(f._id)} className="p-2 text-ink/50 hover:text-red-600 shrink-0"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit FAQ' : 'Add FAQ'}>
        <FormField label="Question"><input className="input" value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} /></FormField>
        <FormField label="Answer" className="mt-4"><textarea className="input min-h-[100px]" value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} /></FormField>
        <FormField label="Display Order" className="mt-4"><input type="number" className="input" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))} /></FormField>
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
