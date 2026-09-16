import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminPageHeader, Modal, FormField, Badge, useConfirm } from '../../components/admin/AdminUI';
import { Loader, EmptyState } from '../../components/States';
import { productApi } from '../../api/services';

const CATEGORIES = ['Pet Food', 'Accessories', 'Toys', 'Grooming Products', 'Pet Care Products', 'Other'];
const emptyForm = { name: '', description: '', category: 'Other', price: '', isAvailable: true, isFeatured: false, isActive: true, displayOrder: 0 };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(() => {
    setLoading(true);
    productApi.getAll({ all: true }).then((res) => setProducts(res.data.products)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm(emptyForm); setFiles([]); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', category: p.category, price: p.price || '', isAvailable: p.isAvailable, isFeatured: p.isFeatured, isActive: p.isActive, displayOrder: p.displayOrder });
    setFiles([]);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error('Product name is required'); return; }
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    files.forEach((f) => fd.append('images', f));
    try {
      if (editing) {
        await productApi.update(editing._id, fd);
        toast.success('Product updated');
      } else {
        await productApi.create(fd);
        toast.success('Product created');
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
    const ok = await confirm('Delete this product? This cannot be undone.');
    if (!ok) return;
    try {
      await productApi.delete(id);
      toast.success('Product deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const removeImage = async (productId, publicId) => {
    try {
      await productApi.removeImage(productId, publicId);
      toast.success('Image removed');
      load();
      setModalOpen(false);
    } catch {
      toast.error('Could not remove image');
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Products / Pet Shop"
        description="Manage the pet shop catalogue shown on the website."
        action={<button onClick={openNew} className="btn-primary px-5 py-2.5"><Plus size={16} /> Add Product</button>}
      />

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <EmptyState title="No products yet" description="Add your first product to get started." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="bg-white border border-ink/8 rounded-2xl overflow-hidden">
              <div className="aspect-square bg-bone">
                {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-ink text-sm">{p.name}</p>
                  <Badge tone={p.isActive ? 'active' : 'inactive'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                <p className="text-xs text-ink/50 mt-1">{p.category} {p.price ? `· ₹${p.price}` : ''}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(p)} className="btn-secondary flex-1 py-1.5 text-xs"><Pencil size={13} /> Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="p-2 text-ink/50 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} wide>
        <FormField label="Name"><input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></FormField>
        <FormField label="Description" className="mt-4"><textarea className="input min-h-[80px]" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></FormField>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <FormField label="Category">
            <select className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Price (optional)"><input type="number" className="input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></FormField>
          <FormField label="Display Order"><input type="number" className="input" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))} /></FormField>
        </div>

        {editing && editing.images?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-ink/80 mb-2">Current Images</p>
            <div className="flex flex-wrap gap-2">
              {editing.images.map((img) => (
                <div key={img.publicId} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(editing._id, img.publicId)} className="absolute inset-0 bg-ink/50 text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <FormField label="Add Images" className="mt-4" hint="Up to 6 images per upload">
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className="text-sm" />
        </FormField>

        <div className="flex flex-wrap gap-5 mt-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink/80">
            <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))} /> In stock
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink/80">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink/80">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="btn-secondary px-5 py-2.5">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary px-5 py-2.5 disabled:opacity-60">{saving ? 'Saving...' : 'Save Product'}</button>
        </div>
      </Modal>
      <ConfirmDialog />
    </div>
  );
}
