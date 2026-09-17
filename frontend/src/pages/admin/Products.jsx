import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
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
  const [currentImages, setCurrentImages] = useState([]); // already-uploaded images for the product being edited, reorderable
  const [dragIndex, setDragIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(() => {
    setLoading(true);
    productApi.getAll({ all: true }).then((res) => setProducts(res.data.products)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  // Local preview URLs for newly selected (not-yet-uploaded) files, so the admin can see
  // what they picked before hitting Save — and revoke them once no longer needed.
  const filePreviews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => filePreviews.forEach((url) => URL.revokeObjectURL(url)), [filePreviews]);

  const openNew = () => { setEditing(null); setForm(emptyForm); setFiles([]); setCurrentImages([]); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', category: p.category, price: p.price || '', isAvailable: p.isAvailable, isFeatured: p.isFeatured, isActive: p.isActive, displayOrder: p.displayOrder });
    setFiles([]);
    setCurrentImages(p.images || []);
    setModalOpen(true);
  };

  const removeSelectedFile = (index) => {
    setFiles((fs) => fs.filter((_, i) => i !== index));
  };

  // Reordering the already-uploaded images — drag & drop for desktop, arrow buttons for
  // touch/keyboard so it works everywhere. Order is only persisted to the server on Save.
  const moveImage = (from, to) => {
    if (to < 0 || to >= currentImages.length) return;
    setCurrentImages((imgs) => {
      const next = [...imgs];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };
  const handleDrop = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) { setDragIndex(null); return; }
    moveImage(dragIndex, dropIndex);
    setDragIndex(null);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error('Product name is required'); return; }
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (editing) fd.append('imageOrder', JSON.stringify(currentImages.map((img) => img.publicId)));
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
      setCurrentImages((imgs) => imgs.filter((img) => img.publicId !== publicId));
      toast.success('Image removed');
      load();
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

        {editing && currentImages.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-ink/80 mb-2">
              Current Images <span className="font-normal text-ink/40">— drag to reorder, first image is used as the cover</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {currentImages.map((img, i) => (
                <div
                  key={img.publicId}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(i)}
                  onDragEnd={() => setDragIndex(null)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden group border-2 cursor-grab active:cursor-grabbing transition-colors ${
                    dragIndex === i ? 'border-paw-500 opacity-50' : 'border-transparent hover:border-paw-400'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover pointer-events-none" />

                  {i === 0 && (
                    <span className="absolute top-1 left-1 text-[9px] font-bold uppercase text-white bg-paw-500 px-1.5 py-0.5 rounded-full">
                      Cover
                    </span>
                  )}

                  <GripVertical size={13} className="absolute top-1 right-1 text-white/80 drop-shadow" />

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/60 backdrop-blur-sm px-1 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => moveImage(i, i - 1)}
                      disabled={i === 0}
                      className="text-white p-0.5 disabled:opacity-30"
                      aria-label="Move left"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(editing._id, img.publicId)}
                      className="text-white text-[10px] font-semibold px-1"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, i + 1)}
                      disabled={i === currentImages.length - 1}
                      className="text-white p-0.5 disabled:opacity-30"
                      aria-label="Move right"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <FormField label="Add Images" className="mt-4" hint="Up to 6 images per upload">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 6))}
            className="text-sm"
          />
        </FormField>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {files.map((f, i) => (
              <div key={`${f.name}-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden group border border-ink/10">
                <img src={filePreviews[i]} alt={f.name} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeSelectedFile(i)}
                  className="absolute inset-0 bg-ink/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  aria-label={`Remove ${f.name}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

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