import { useState } from 'react';
import toast from 'react-hot-toast';
import { AdminPageHeader, FormField } from '../../components/admin/AdminUI';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/services';

export default function AdminProfile() {
  const { admin, setAdmin } = useAuth();
  const [name, setName] = useState(admin?.name || '');
  const [file, setFile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const saveProfile = async () => {
    setSavingProfile(true);
    const fd = new FormData();
    fd.append('name', name);
    if (file) fd.append('avatar', file);
    try {
      const res = await authApi.updateProfile(fd);
      setAdmin(res.data.admin);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 8) { toast.error('New password must be at least 8 characters'); return; }
    setSavingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Admin Profile" description="Manage your own account details." />

      <div className="bg-white border border-ink/8 rounded-2xl p-6 max-w-lg space-y-4">
        <h3 className="font-display font-semibold text-lg">Profile</h3>
        {admin?.avatar?.url && <img src={admin.avatar.url} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />}
        <FormField label="Name"><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></FormField>
        <FormField label="Avatar"><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm" /></FormField>
        <button onClick={saveProfile} disabled={savingProfile} className="btn-primary px-6 py-2.5 disabled:opacity-60">{savingProfile ? 'Saving...' : 'Save Profile'}</button>
      </div>

      <div className="bg-white border border-ink/8 rounded-2xl p-6 max-w-lg space-y-4">
        <h3 className="font-display font-semibold text-lg">Change Password</h3>
        <FormField label="Current Password"><input type="password" className="input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></FormField>
        <FormField label="New Password" hint="Minimum 8 characters"><input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></FormField>
        <button onClick={changePassword} disabled={savingPassword} className="btn-primary px-6 py-2.5 disabled:opacity-60">{savingPassword ? 'Updating...' : 'Change Password'}</button>
      </div>
    </div>
  );
}
