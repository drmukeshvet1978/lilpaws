import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AdminPageHeader, FormField } from '../../components/admin/AdminUI';
import { Loader } from '../../components/States';
import { settingsApi } from '../../api/services';

export default function AdminSeoSettings() {
  const [seo, setSeo] = useState(null);
  const [keywordsText, setKeywordsText] = useState('');
  const [ogFile, setOgFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsApi.get().then((res) => {
      setSeo(res.data.settings.seo);
      setKeywordsText((res.data.settings.seo.keywords || []).join(', '));
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const keywords = keywordsText.split(',').map((k) => k.trim()).filter(Boolean);
      const res = await settingsApi.update({ seo: { ...seo, keywords } });
      setSeo(res.data.settings.seo);
      if (ogFile) {
        const fd = new FormData();
        fd.append('image', ogFile);
        const ogRes = await settingsApi.updateOgImage(fd);
        setSeo(ogRes.data.settings.seo);
        setOgFile(null);
      }
      toast.success('SEO settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !seo) return <Loader />;

  return (
    <div>
      <AdminPageHeader title="SEO Settings" description="Control how Lil Paws appears in search results and link previews." />

      <div className="bg-white border border-ink/8 rounded-2xl p-6 max-w-2xl space-y-4">
        <FormField label="Meta Title" hint="Shown as the page title in search results"><input className="input" value={seo.metaTitle} onChange={(e) => setSeo((s) => ({ ...s, metaTitle: e.target.value }))} /></FormField>
        <FormField label="Meta Description"><textarea className="input min-h-[80px]" value={seo.metaDescription} onChange={(e) => setSeo((s) => ({ ...s, metaDescription: e.target.value }))} /></FormField>
        <FormField label="Keywords" hint="Comma-separated, e.g. Lil Paws Dog Clinic, veterinary clinic Bhopal"><input className="input" value={keywordsText} onChange={(e) => setKeywordsText(e.target.value)} /></FormField>
        <FormField label="Robots" hint="e.g. index, follow"><input className="input" value={seo.robots} onChange={(e) => setSeo((s) => ({ ...s, robots: e.target.value }))} /></FormField>
        <FormField label="Open Graph Image" hint="Shown when the site is shared on social media">
          {seo.ogImage?.url && <img src={seo.ogImage.url} alt="OG" className="h-24 object-cover rounded-lg mb-2" />}
          <input type="file" accept="image/*" onChange={(e) => setOgFile(e.target.files[0])} className="text-sm" />
        </FormField>
        <button onClick={handleSave} disabled={saving} className="btn-primary px-6 py-2.5 disabled:opacity-60">{saving ? 'Saving...' : 'Save SEO Settings'}</button>
      </div>
    </div>
  );
}
