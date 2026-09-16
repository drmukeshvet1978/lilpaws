import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AdminPageHeader, FormField } from '../../components/admin/AdminUI';
import { Loader } from '../../components/States';
import { aboutApi } from '../../api/services';

export default function AdminAbout() {
  const [form, setForm] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    aboutApi.get().then((res) => setForm(res.data.profile)).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const fd = new FormData();
    ['name', 'designation', 'biography', 'aboutText', 'mission', 'vision', 'clinicStory'].forEach((k) => fd.append(k, form[k] || ''));
    if (file) fd.append('photo', file);
    try {
      const res = await aboutApi.update(fd);
      setForm(res.data.profile);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <Loader />;

  return (
    <div>
      <AdminPageHeader title="About / Doctor" description="Edit Dr. Mukesh Tiwari's profile and the clinic story." />

      <div className="bg-white border border-ink/8 rounded-2xl p-6 max-w-2xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Doctor Name"><input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></FormField>
          <FormField label="Designation"><input className="input" value={form.designation} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} /></FormField>
        </div>
        <FormField label="Biography"><textarea className="input min-h-[100px]" value={form.biography} onChange={(e) => setForm((f) => ({ ...f, biography: e.target.value }))} /></FormField>
        <FormField label="About Text (shown on homepage)"><textarea className="input min-h-[80px]" value={form.aboutText} onChange={(e) => setForm((f) => ({ ...f, aboutText: e.target.value }))} /></FormField>
        <FormField label="Clinic Story"><textarea className="input min-h-[100px]" value={form.clinicStory} onChange={(e) => setForm((f) => ({ ...f, clinicStory: e.target.value }))} /></FormField>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Mission"><textarea className="input min-h-[80px]" value={form.mission} onChange={(e) => setForm((f) => ({ ...f, mission: e.target.value }))} /></FormField>
          <FormField label="Vision"><textarea className="input min-h-[80px]" value={form.vision} onChange={(e) => setForm((f) => ({ ...f, vision: e.target.value }))} /></FormField>
        </div>
        <FormField label="Photo">
          {form.photo?.url && <img src={form.photo.url} alt="Current" className="w-24 h-24 rounded-xl object-cover mb-2" />}
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
        </FormField>
        <button onClick={handleSave} disabled={saving} className="btn-primary px-6 py-2.5 disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </div>
  );
}
