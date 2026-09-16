import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AdminPageHeader, FormField } from '../../components/admin/AdminUI';
import { Loader } from '../../components/States';
import { settingsApi } from '../../api/services';

export default function AdminContactSettings() {
  const [settings, setSettings] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsApi.get().then((res) => setSettings(res.data.settings)).finally(() => setLoading(false));
  }, []);

  const update = (field, value) => setSettings((s) => ({ ...s, [field]: value }));
  const updateSocial = (field, value) => setSettings((s) => ({ ...s, socialLinks: { ...s.socialLinks, [field]: value } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { seo, logo, ...rest } = settings;
      const res = await settingsApi.update(rest);
      setSettings(res.data.settings);
      if (logoFile) {
        const fd = new FormData();
        fd.append('logo', logoFile);
        const logoRes = await settingsApi.updateLogo(fd);
        setSettings(logoRes.data.settings);
        setLogoFile(null);
      }
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) return <Loader />;

  return (
    <div>
      <AdminPageHeader title="Contact Information" description="Manage address, phone, WhatsApp, email, map, and social links." />

      <div className="bg-white border border-ink/8 rounded-2xl p-6 max-w-2xl space-y-4">
        <FormField label="Site Name"><input className="input" value={settings.siteName} onChange={(e) => update('siteName', e.target.value)} /></FormField>
        <FormField label="Address"><textarea className="input" value={settings.address} onChange={(e) => update('address', e.target.value)} /></FormField>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Phone"><input className="input" value={settings.phone} onChange={(e) => update('phone', e.target.value)} /></FormField>
          <FormField label="WhatsApp" hint="Include country code, digits only e.g. 919876543210"><input className="input" value={settings.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} /></FormField>
          <FormField label="Email"><input className="input" value={settings.email} onChange={(e) => update('email', e.target.value)} /></FormField>
        </div>

        <FormField label="Google Maps Embed URL" hint="Paste the src from Google Maps 'Embed a map' share option"><input className="input" value={settings.googleMapsEmbedUrl} onChange={(e) => update('googleMapsEmbedUrl', e.target.value)} /></FormField>
        <FormField label="Google Maps Directions URL"><input className="input" value={settings.googleMapsDirectionsUrl} onChange={(e) => update('googleMapsDirectionsUrl', e.target.value)} /></FormField>

        <div className="grid sm:grid-cols-3 gap-4">
          <FormField label="Facebook"><input className="input" value={settings.socialLinks?.facebook || ''} onChange={(e) => updateSocial('facebook', e.target.value)} /></FormField>
          <FormField label="Instagram"><input className="input" value={settings.socialLinks?.instagram || ''} onChange={(e) => updateSocial('instagram', e.target.value)} /></FormField>
          <FormField label="YouTube"><input className="input" value={settings.socialLinks?.youtube || ''} onChange={(e) => updateSocial('youtube', e.target.value)} /></FormField>
        </div>

        <FormField label="Footer Description"><textarea className="input" value={settings.footerDescription} onChange={(e) => update('footerDescription', e.target.value)} /></FormField>

        <FormField label="Logo">
          {settings.logo?.url && <img src={settings.logo.url} alt="Current logo" className="h-16 object-contain mb-2 bg-bone rounded-lg p-2" />}
          <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="text-sm" />
        </FormField>

        <button onClick={handleSave} disabled={saving} className="btn-primary px-6 py-2.5 disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </div>
  );
}
