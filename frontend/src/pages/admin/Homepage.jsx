import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader, FormField } from '../../components/admin/AdminUI';
import { Loader } from '../../components/States';
import { homepageApi } from '../../api/services';

export default function AdminHomepage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroFile, setHeroFile] = useState(null);

  const load = () => homepageApi.get().then((res) => setContent(res.data.content)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const saveHero = async () => {
    setSaving(true);
    try {
      await homepageApi.update({ hero: content.hero });
      toast.success('Hero section saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const saveLists = async () => {
    setSaving(true);
    try {
      await homepageApi.update({ quickInfo: content.quickInfo, whyChooseUs: content.whyChooseUs });
      toast.success('Sections saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const uploadHeroImage = async () => {
    if (!heroFile) return;
    const fd = new FormData();
    fd.append('image', heroFile);
    try {
      const res = await homepageApi.addHeroImage(fd);
      setContent(res.data.content);
      setHeroFile(null);
      toast.success('Image added');
    } catch {
      toast.error('Upload failed');
    }
  };

  const removeHeroImage = async (publicId) => {
    const res = await homepageApi.removeHeroImage(publicId);
    setContent(res.data.content);
  };

  const addListItem = (key) => {
    setContent((c) => ({ ...c, [key]: [...(c[key] || []), { title: '', description: '', icon: '', isActive: true, displayOrder: (c[key]?.length || 0) }] }));
  };
  const updateListItem = (key, idx, field, value) => {
    setContent((c) => {
      const list = [...c[key]];
      list[idx] = { ...list[idx], [field]: value };
      return { ...c, [key]: list };
    });
  };
  const removeListItem = (key, idx) => {
    setContent((c) => ({ ...c, [key]: c[key].filter((_, i) => i !== idx) }));
  };

  if (loading || !content) return <Loader />;

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Homepage" description="Edit the hero section, quick-info strip, and why-choose-us content." />

      <div className="bg-white border border-ink/8 rounded-2xl p-6">
        <h3 className="font-display font-semibold text-lg mb-4">Hero Section</h3>
        <FormField label="Title"><input className="input" value={content.hero.title} onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, title: e.target.value } }))} /></FormField>
        <FormField label="Subtitle" className="mt-4"><textarea className="input min-h-[80px]" value={content.hero.subtitle} onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, subtitle: e.target.value } }))} /></FormField>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <FormField label="Primary CTA Text"><input className="input" value={content.hero.primaryCtaText} onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, primaryCtaText: e.target.value } }))} /></FormField>
          <FormField label="Primary CTA Link"><input className="input" value={content.hero.primaryCtaLink} onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, primaryCtaLink: e.target.value } }))} /></FormField>
          <FormField label="Secondary CTA Text"><input className="input" value={content.hero.secondaryCtaText} onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, secondaryCtaText: e.target.value } }))} /></FormField>
          <FormField label="Secondary CTA Link"><input className="input" value={content.hero.secondaryCtaLink} onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, secondaryCtaLink: e.target.value } }))} /></FormField>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-ink/80 mb-2">Hero Images</p>
          <div className="flex flex-wrap gap-3 mb-3">
            {content.hero.images?.map((img) => (
              <div key={img.publicId} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeHeroImage(img.publicId)} className="absolute inset-0 bg-ink/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input type="file" accept="image/*" onChange={(e) => setHeroFile(e.target.files[0])} className="text-sm" />
            <button onClick={uploadHeroImage} className="btn-secondary px-4 py-1.5 text-sm">Add Image</button>
          </div>
        </div>

        <button onClick={saveHero} disabled={saving} className="btn-primary px-6 py-2.5 mt-5 disabled:opacity-60">{saving ? 'Saving...' : 'Save Hero Section'}</button>
      </div>

      <ListEditor title="Quick Info Strip" items={content.quickInfo} onAdd={() => addListItem('quickInfo')} onUpdate={(i, f, v) => updateListItem('quickInfo', i, f, v)} onRemove={(i) => removeListItem('quickInfo', i)} />
      <ListEditor title="Why Choose Us" items={content.whyChooseUs} onAdd={() => addListItem('whyChooseUs')} onUpdate={(i, f, v) => updateListItem('whyChooseUs', i, f, v)} onRemove={(i) => removeListItem('whyChooseUs', i)} />

      <button onClick={saveLists} disabled={saving} className="btn-primary px-6 py-2.5 disabled:opacity-60">{saving ? 'Saving...' : 'Save Sections'}</button>
    </div>
  );
}

function ListEditor({ title, items = [], onAdd, onUpdate, onRemove }) {
  return (
    <div className="bg-white border border-ink/8 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg">{title}</h3>
        <button onClick={onAdd} className="btn-secondary px-3 py-1.5 text-sm"><Plus size={14} /> Add Item</button>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="border border-ink/8 rounded-xl p-4 grid sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-start">
            <input className="input" placeholder="Title" value={item.title} onChange={(e) => onUpdate(i, 'title', e.target.value)} />
            <input className="input" placeholder="Description" value={item.description} onChange={(e) => onUpdate(i, 'description', e.target.value)} />
            <input className="input w-28" placeholder="icon-name" value={item.icon} onChange={(e) => onUpdate(i, 'icon', e.target.value)} />
            <button onClick={() => onRemove(i)} className="p-2.5 text-ink/40 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-ink/40">No items yet. Click "Add Item" to create one.</p>}
      </div>
    </div>
  );
}
