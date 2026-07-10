import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [proposal, setProposal] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [applying, setApplying] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    api.get(`/projects/${id}`).then(res => setProject(res.data.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await api.post(`/projects/${id}/applications`, {
        proposal, expectedBudget: budget, estimatedCompletionDays: timeline
      });
      alert('Application submitted successfully!');
      navigate('/student-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting application');
    } finally {
      setApplying(false);
    }
  };

  const handleAIGenerate = async () => {
    setLoadingAI(true);
    try {
      const res = await api.post('/ai/generate-proposal', { projectId: id });
      setProposal(res.data.proposal);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate proposal with AI.');
    } finally {
      setLoadingAI(false);
    }
  };

  if (loading) return <div className="text-center p-24 font-bold uppercase tracking-widest text-sm">LOADING DATA...</div>;
  if (!project) return <div className="text-center p-24 font-bold uppercase tracking-widest text-sm border-4 border-black max-w-xl mx-auto mt-16">RECORD NOT FOUND.</div>;

  return (
    <div className="flex-grow flex flex-col font-sans">
      <section className="bg-background border-b-4 border-black px-6 py-20 relative swiss-dots">
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center gap-4 mb-8">
               <span className="bg-[var(--color-swiss-red)] text-white font-bold px-3 py-1 text-lg tracking-widest">02.</span>
               <h2 className="font-bold text-sm tracking-widest uppercase bg-white px-2">REQUIREMENT SPECIFICATION</h2>
               
               {user && user.role === 'student' && (
                 <button 
                   onClick={() => {
                     const reason = window.prompt('Provide a reason for flagging this project specification:');
                     if (reason) {
                       api.post('/reports', { targetType: 'project', targetId: project._id, reason })
                         .then(() => alert('Report submitted successfully.'))
                         .catch(() => alert('Failed to submit report.'));
                     }
                   }}
                   className="ml-auto bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-swiss-red)] transition-colors"
                 >
                   FLAG PROJECT
                 </button>
               )}
            </div>
           
           <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12">
             <div className="lg:w-2/3 border-l-4 border-black pl-8">
               <h1 className="font-black text-6xl md:text-8xl tracking-tighter uppercase mb-6 leading-[0.85]">{project.title}</h1>
               <div className="inline-block bg-black text-white px-4 py-2 font-black uppercase tracking-widest text-xl">
                 ${project.budget}
               </div>
             </div>
             
             <div className="lg:w-1/3 bg-muted p-8 border-4 border-black">
               <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-[var(--color-swiss-red)]">ENTERPRISE</h3>
               <div className="flex items-center gap-4 mb-6">
                 <Link to={`/profile/${project.client._id}`} className="w-16 h-16 bg-black text-white font-black flex items-center justify-center text-3xl hover:bg-[var(--color-swiss-red)] transition-colors">
                   {project.client.name.charAt(0)}
                 </Link>
                 <Link to={`/profile/${project.client._id}`} className="font-black text-2xl uppercase tracking-tighter hover:text-[var(--color-swiss-red)] transition-colors">
                   {project.client.name}
                 </Link>
               </div>
               
               <h3 className="text-sm font-black uppercase tracking-widest mb-4 mt-8 text-[var(--color-swiss-red)]">COMPETENCIES</h3>
               <div className="flex flex-wrap gap-2">
                 {project.skillsRequired.map(skill => (
                   <span key={skill} className="border-2 border-black bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                     {skill}
                   </span>
                 ))}
               </div>
             </div>
           </div>
        </div>
      </section>
      
      <section className="bg-white px-6 py-16 border-b-4 border-black relative">
        <div className="max-w-5xl mx-auto border-4 border-black p-12 bg-muted swiss-noise">
           <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b-4 border-black pb-4">DETAILED SPECIFICATION</h3>
           <p className="font-medium text-2xl leading-relaxed whitespace-pre-wrap">{project.description}</p>
        </div>
      </section>

      {user?.role === 'student' && project.status === 'open' && (
        <section className="bg-black text-white px-6 py-24 relative overflow-hidden">
          <div className="absolute inset-0 swiss-grid-pattern opacity-20 pointer-events-none invert"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="font-black text-6xl tracking-tighter uppercase mb-12">SUBMIT PROPOSAL.</h2>
            <form onSubmit={handleApply} className="space-y-10">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="block text-sm font-bold uppercase tracking-widest text-white">ARCHITECTURAL PROPOSAL</label>
                  <button 
                    type="button" 
                    onClick={handleAIGenerate}
                    disabled={loadingAI}
                    className="bg-white text-black px-3 py-1 text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-swiss-red)] hover:text-white transition-colors disabled:opacity-50"
                  >
                    {loadingAI ? 'GENERATING...' : '✨ GENERATE PROPOSAL'}
                  </button>
                </div>
                <textarea 
                  required value={proposal} onChange={e => setProposal(e.target.value)} 
                  className="w-full border-4 border-white p-6 bg-transparent text-xl font-medium focus:border-[var(--color-swiss-red)] outline-none transition-colors h-48 leading-snug text-white" 
                  placeholder="Detail your implementation strategy..." 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3">EXPECTED BUDGET ($)</label>
                  <input 
                    type="number" required value={budget} onChange={e => setBudget(e.target.value)} 
                    className="w-full border-b-4 border-white p-4 bg-transparent text-3xl font-black focus:border-[var(--color-swiss-red)] outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3">TIMELINE (DAYS)</label>
                  <input 
                    type="number" required value={timeline} onChange={e => setTimeline(e.target.value)} 
                    className="w-full border-b-4 border-white p-4 bg-transparent text-3xl font-black focus:border-[var(--color-swiss-red)] outline-none transition-colors" 
                  />
                </div>
              </div>
              <button disabled={applying} type="submit" className="w-full bg-[var(--color-swiss-red)] text-white font-black text-xl uppercase tracking-widest py-8 border-4 border-[var(--color-swiss-red)] hover:bg-white hover:text-black hover:border-white transition-colors mt-8 disabled:opacity-50">
                {applying ? 'TRANSMITTING...' : 'SUBMIT PROPOSAL'}
              </button>
            </form>
          </div>
        </section>
      )}

      {!user && (
        <section className="bg-black text-white px-6 py-24 text-center">
          <h2 className="font-black text-5xl tracking-tighter uppercase mb-8">AUTHENTICATION REQUIRED</h2>
          <p className="font-bold text-sm uppercase tracking-widest mb-10 opacity-70">Initialize a session to submit proposals.</p>
          <Link to="/login" className="inline-block bg-[var(--color-swiss-red)] text-white border-4 border-[var(--color-swiss-red)] px-12 py-6 text-lg font-black uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-colors">
            LOG IN
          </Link>
        </section>
      )}
    </div>
  );
}
