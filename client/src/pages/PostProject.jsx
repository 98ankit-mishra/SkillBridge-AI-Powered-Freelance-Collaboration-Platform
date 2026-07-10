import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function PostProject() {
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Web Development', skillsRequired: '', budget: '' });
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/projects', formData);
      navigate('/client-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting project');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAIEnhance = async () => {
    if (!formData.description) return alert('Please enter a draft description first.');
    setLoadingAI(true);
    try {
      const res = await api.post('/ai/enhance-project', {
        title: formData.title,
        category: formData.category,
        skills: formData.skillsRequired ? formData.skillsRequired.split(',').map(s => s.trim()) : [],
        description: formData.description
      });
      setFormData({ ...formData, description: res.data.enhancedDescription });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enhance description with AI.');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col font-sans">
      <section className="bg-background border-b-4 border-black px-6 py-20 relative swiss-noise">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-[var(--color-swiss-red)] text-white font-bold px-3 py-1 text-lg tracking-widest">03.</span>
            <h2 className="font-bold text-sm tracking-widest uppercase bg-white px-2">PROJECT INITIATION</h2>
          </div>
          <h1 className="font-black text-6xl md:text-8xl tracking-tighter uppercase mb-10 leading-[0.85]">ISSUE<br />REQUIREMENT.</h1>
          
          <form onSubmit={handleSubmit} className="bg-white p-12 border-4 border-black space-y-12">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest mb-3">REQUIREMENT TITLE</label>
              <input 
                name="title" required value={formData.title} onChange={handleChange} 
                className="w-full border-b-4 border-black p-4 bg-transparent text-3xl font-black focus:border-[var(--color-swiss-red)] outline-none transition-colors" 
                placeholder="E.G. DEVELOP REACT DESIGN SYSTEM" 
              />
            </div>
            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="block text-sm font-bold uppercase tracking-widest">DETAILED SPECIFICATION</label>
                <button 
                  type="button" 
                  onClick={handleAIEnhance}
                  disabled={loadingAI || !formData.description}
                  className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-swiss-red)] transition-colors disabled:opacity-50"
                >
                  {loadingAI ? 'ENHANCING...' : '✨ ENHANCE WITH AI'}
                </button>
              </div>
              <textarea 
                name="description" required value={formData.description} onChange={handleChange} 
                className="w-full border-4 border-black p-6 bg-transparent text-xl font-medium focus:border-[var(--color-swiss-red)] outline-none transition-colors h-56 leading-relaxed" 
                placeholder="Provide absolute clarity on deliverables..." 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest mb-3">REQUIREMENT CATEGORY</label>
                <select 
                  name="category" value={formData.category} onChange={handleChange}
                  className="w-full border-b-4 border-black p-4 bg-transparent text-xl font-bold focus:border-[var(--color-swiss-red)] outline-none transition-colors appearance-none"
                >
                  <option value="Web Development">WEB DEVELOPMENT</option>
                  <option value="Mobile Development">MOBILE DEVELOPMENT</option>
                  <option value="UI/UX Design">UI/UX DESIGN</option>
                  <option value="Backend Architecture">BACKEND ARCHITECTURE</option>
                  <option value="Data Science">DATA SCIENCE</option>
                  <option value="Other">OTHER</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest mb-3">REQUIRED COMPETENCIES</label>
                <input 
                  name="skillsRequired" required value={formData.skillsRequired} onChange={handleChange} 
                  className="w-full border-b-4 border-black p-4 bg-transparent text-xl font-bold focus:border-[var(--color-swiss-red)] outline-none transition-colors" 
                  placeholder="REACT, NODE, FIGMA" 
                />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-3">COMMA SEPARATED VALUES</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest mb-3">ALLOCATED BUDGET ($)</label>
              <input 
                type="number" name="budget" required value={formData.budget} onChange={handleChange} 
                className="w-full border-b-4 border-black p-4 bg-transparent text-3xl font-black focus:border-[var(--color-swiss-red)] outline-none transition-colors" 
                placeholder="5000" 
              />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-black text-white font-black text-xl uppercase tracking-widest py-8 border-4 border-black hover:bg-[var(--color-swiss-red)] hover:border-[var(--color-swiss-red)] transition-colors mt-8 disabled:opacity-50">
              {loading ? 'COMMITTING...' : 'PUBLISH REQUIREMENT'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
