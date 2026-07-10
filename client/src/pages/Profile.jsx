import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Profile() {
  const { user, fetchUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '', bio: '', college: '', skills: '', companyName: '', description: '', website: ''
  });

  useEffect(() => {
    api.get('/profiles').then(res => {
      setProfile(res.data.data.profile);
      const data = res.data.data.profile || {};
      setFormData({
        name: user?.name || '',
        bio: data.bio || '',
        college: data.college || '',
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
        companyName: data.companyName || '',
        description: data.description || '',
        website: data.website || ''
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/profiles', formData);
      await fetchUser();
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    
    setUploading(true);
    try {
      await api.post('/profiles/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      await fetchUser();
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    
    setUploading(true);
    try {
      const res = await api.post('/profiles/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setProfile(res.data.data);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center p-24 font-bold uppercase tracking-widest text-sm">LOADING PROFILE...</div>;

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 relative swiss-noise min-h-[calc(100vh-80px)]">
      <div className="flex items-center gap-4 mb-8">
        <span className="bg-[var(--color-swiss-red)] text-white font-bold px-3 py-1 text-lg tracking-widest">01.</span>
        <h2 className="font-bold text-sm tracking-widest uppercase">IDENTITY MANAGEMENT</h2>
      </div>
      <div className="mb-16">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">PROFILE</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-muted p-12 border-4 border-black flex flex-col items-center swiss-dots">
            <div className="relative mb-6">
              <div className="w-48 h-48 bg-white flex items-center justify-center overflow-hidden border-4 border-black relative z-10">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover grayscale mix-blend-multiply" /> : <span className="text-black text-7xl font-black">{user?.name?.charAt(0)}</span>}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-4 -right-4 bg-[var(--color-swiss-red)] text-white p-4 border-4 border-black hover:bg-black hover:text-white transition-colors z-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase text-center mt-4">{user?.name}</h2>
            <p className="text-[var(--color-swiss-red)] font-bold text-sm uppercase tracking-widest mt-2 px-4 py-1 border-2 border-[var(--color-swiss-red)]">{user?.role}</p>
            {uploading && <p className="text-xs font-bold uppercase tracking-widest mt-6 bg-black text-white inline-block px-4 py-2 animate-pulse">UPLOADING...</p>}
          </div>
        </div>

        <div className="lg:col-span-8">
          <form onSubmit={handleSave} className="bg-white p-10 md:p-16 border-4 border-black space-y-10">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest mb-3">FULL NAME</label>
              <input name="name" value={formData.name} onChange={handleChange} required className="w-full border-b-4 border-black p-4 bg-transparent text-2xl font-bold focus:border-[var(--color-swiss-red)] focus:outline-none transition-colors" />
            </div>

            {user?.role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3">BIOGRAPHY</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full border-4 border-black p-4 bg-transparent text-lg focus:border-[var(--color-swiss-red)] focus:outline-none transition-colors h-40 leading-snug" placeholder="State your objective..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest mb-3">INSTITUTION</label>
                    <input name="college" value={formData.college} onChange={handleChange} className="w-full border-b-4 border-black p-4 bg-transparent text-lg font-bold focus:border-[var(--color-swiss-red)] focus:outline-none transition-colors" placeholder="E.G. TECHNICAL INSTITUTE" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest mb-3">COMPETENCIES</label>
                    <input name="skills" value={formData.skills} onChange={handleChange} className="w-full border-b-4 border-black p-4 bg-transparent text-lg font-bold focus:border-[var(--color-swiss-red)] focus:outline-none transition-colors" placeholder="REACT, NODE, DESIGN" />
                  </div>
                </div>
                <div className="pt-10 border-t-4 border-black mt-10">
                  <label className="block text-sm font-bold uppercase tracking-widest mb-6">CURRICULUM VITAE (PDF)</label>
                  <div className="flex flex-wrap items-center gap-6">
                    <button type="button" onClick={() => resumeInputRef.current?.click()} className="bg-black text-white border-4 border-black px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-[var(--color-swiss-red)] hover:border-[var(--color-swiss-red)] transition-colors">SELECT DOCUMENT</button>
                    <input type="file" ref={resumeInputRef} onChange={handleResumeUpload} className="hidden" accept=".pdf" />
                    {profile?.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-black font-bold uppercase tracking-widest text-sm border-b-4 border-black hover:border-[var(--color-swiss-red)] hover:text-[var(--color-swiss-red)] pb-1 transition-colors">VIEW CURRENT</a>}
                  </div>
                </div>
              </>
            )}

            {user?.role === 'client' && (
              <>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3">ENTERPRISE NAME</label>
                  <input name="companyName" value={formData.companyName} onChange={handleChange} className="w-full border-b-4 border-black p-4 bg-transparent text-2xl font-bold focus:border-[var(--color-swiss-red)] focus:outline-none transition-colors" placeholder="ACME CORP" />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3">ENTERPRISE OVERVIEW</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border-4 border-black p-4 bg-transparent text-lg focus:border-[var(--color-swiss-red)] focus:outline-none transition-colors h-40 leading-snug" placeholder="State your operational objectives..." />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3">DIGITAL PRESENCE (URL)</label>
                  <input name="website" type="url" value={formData.website} onChange={handleChange} className="w-full border-b-4 border-black p-4 bg-transparent text-lg font-bold focus:border-[var(--color-swiss-red)] focus:outline-none transition-colors" placeholder="HTTPS://EXAMPLE.COM" />
                </div>
              </>
            )}

            <button disabled={saving || uploading} type="submit" className="w-full bg-black text-white font-black text-lg uppercase tracking-widest py-6 border-4 border-black hover:bg-[var(--color-swiss-red)] hover:border-[var(--color-swiss-red)] transition-colors mt-12 disabled:opacity-50">
              {saving ? 'COMMITTING...' : 'COMMIT CHANGES'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
