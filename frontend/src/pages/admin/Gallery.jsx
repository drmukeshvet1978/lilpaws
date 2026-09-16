import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Upload, Trash2, Star } from 'lucide-react';
import { AdminPageHeader, FormField, useConfirm } from '../../components/admin/AdminUI';
import { Loader, EmptyState } from '../../components/States';
import { galleryApi } from '../../api/services';

const CATEGORIES = ['Clinic', 'Pets', 'Team', 'Events', 'Products', 'Other'];

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Other');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(() => {
    setLoading(true);
    galleryApi.getAll().then((res) => setImages(res.data.images)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleUpload = async () => {
    if (files.length === 0) { toast.error('Select at least one image'); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append('category', category);
    files.forEach((f) => fd.append('images', f));
    try {
      await galleryApi.upload(fd);
      toast.success('Images uploaded');
      setFiles([]);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this image? This cannot be undone.');
    if (!ok) return;
    try {
      await galleryApi.delete(id);
      toast.success('Image deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const toggleFeatured = async (img) => {
    const fd = new FormData();
    fd.append('isFeatured', !img.isFeatured);
    await galleryApi.update(img._id, fd);
    load();
  };

  return (
    <div>
      <AdminPageHeader title="Gallery" description="Upload and organize photos shown in the public gallery." />

      <div className="bg-white border border-ink/8 rounded-2xl p-5 mb-6 flex flex-wrap items-end gap-4">
        <FormField label="Category">
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FormField>
        <FormField label="Images" hint="You can select multiple files">
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className="text-sm" />
        </FormField>
        <button onClick={handleUpload} disabled={uploading} className="btn-primary px-5 py-2.5 disabled:opacity-60">
          <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : images.length === 0 ? (
        <EmptyState title="No images yet" description="Upload your first photos above." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img._id} className="relative group rounded-2xl overflow-hidden bg-bone aspect-square">
              <img src={img.url} alt={img.altText || img.category} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => toggleFeatured(img)} className={`p-2 rounded-full ${img.isFeatured ? 'bg-paw-500 text-white' : 'bg-white text-ink'}`}>
                  <Star size={15} fill={img.isFeatured ? 'white' : 'none'} />
                </button>
                <button onClick={() => handleDelete(img._id)} className="p-2 rounded-full bg-white text-red-600">
                  <Trash2 size={15} />
                </button>
              </div>
              <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-ink/70 text-white px-2 py-0.5 rounded-full">{img.category}</span>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog />
    </div>
  );
}
