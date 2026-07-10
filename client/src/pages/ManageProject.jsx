import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function ManageProject() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/projects/${id}/applications`)
    ]).then(([projRes, appsRes]) => {
      setProject(projRes.data.data);
      setApplications(appsRes.data.data);
    }).catch(err => {
      console.error(err);
      if (err.response?.status === 403) navigate('/client-dashboard');
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleHire = async (appId) => {
    if (!window.confirm("Confirm engagement? This locks the requirement and initializes a workspace.")) return;
    try {
      await api.patch(`/applications/${appId}/accept`);
      alert("Talent engaged. Workspace initialized.");
      navigate('/client-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing engagement');
    }
  };

  if (loading) return <div className="text-center p-24 font-bold uppercase tracking-widest text-sm">LOADING DATA...</div>;
  if (!project) return <div className="text-center p-24 font-bold uppercase tracking-widest text-sm border-4 border-black max-w-xl mx-auto mt-16">RECORD NOT FOUND.</div>;

  return (
    <div className="flex-grow flex flex-col font-sans">
      <section className="bg-background border-b-4 border-black px-6 py-20 relative swiss-dots">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-8">
             <span className="bg-[var(--color-swiss-red)] text-white font-bold px-3 py-1 text-lg tracking-widest">04.</span>
             <h2 className="font-bold text-sm tracking-widest uppercase bg-white px-2">EVALUATION DASHBOARD</h2>
          </div>
          
          <div className="bg-white p-12 border-4 border-black mb-16">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-none">{project.title}</h1>
            <span className="inline-block bg-black text-white px-4 py-2 font-black uppercase tracking-widest text-xl mb-8">
              {project.status.replace('_', ' ')}
            </span>
            <p className="font-medium text-2xl leading-relaxed max-w-3xl opacity-80">{project.description}</p>
          </div>

          <h2 className="text-4xl font-black tracking-tighter uppercase mb-10 flex items-center gap-6">
            PROPOSALS ({applications.length})
            <span className="flex-grow h-1 bg-black opacity-10"></span>
          </h2>
          
          {applications.length === 0 ? (
            <div className="bg-white border-4 border-black p-16 text-center swiss-noise">
              <p className="font-bold text-lg uppercase tracking-widest">NO PROPOSALS RECEIVED YET.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {applications.map(app => (
                <div key={app._id} className="bg-white border-4 border-black flex flex-col group hover:bg-[var(--color-swiss-red)] hover:text-white transition-colors duration-150 relative">
                  <div className="p-10 flex-grow">
                    <div className="flex items-center gap-6 mb-8 border-b-4 border-black group-hover:border-white pb-6 transition-colors">
                      <Link to={`/profile/${app.student._id}`} className="w-20 h-20 bg-black text-white flex items-center justify-center font-black text-4xl group-hover:bg-white group-hover:text-[var(--color-swiss-red)] transition-colors">
                        {app.student.name.charAt(0)}
                      </Link>
                      <div>
                        <Link to={`/profile/${app.student._id}`} className="font-black text-3xl uppercase tracking-tighter hover:underline">
                          {app.student.name}
                        </Link>
                        <br />
                        <span className="bg-black text-white group-hover:bg-white group-hover:text-[var(--color-swiss-red)] px-3 py-1 text-xs font-bold uppercase tracking-widest mt-3 inline-block transition-colors">
                          STATUS: {app.status}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-70 group-hover:opacity-100">ARCHITECTURAL PROPOSAL</h4>
                    <div className="text-lg font-medium whitespace-pre-wrap leading-relaxed opacity-90 mb-10">
                      {app.proposal}
                    </div>
                    
                    <div className="flex flex-col gap-3 text-sm font-bold uppercase tracking-widest">
                      <div className="flex justify-between border-b-2 border-black/20 group-hover:border-white/40 pb-2">
                        <span>EXPECTED BUDGET</span>
                        <strong className="text-xl font-black">${app.expectedBudget}</strong>
                      </div>
                      <div className="flex justify-between border-b-2 border-black/20 group-hover:border-white/40 pb-2">
                        <span>TIMELINE</span>
                        <strong className="text-xl font-black">{app.estimatedCompletionDays} DAYS</strong>
                      </div>
                    </div>
                  </div>
                  
                  {project.status === 'open' && app.status === 'pending' && (
                    <button 
                      onClick={() => handleHire(app._id)}
                      className="w-full bg-black text-white font-black text-lg uppercase tracking-widest py-6 border-t-4 border-black group-hover:bg-white group-hover:text-black transition-colors"
                    >
                      ENGAGE CANDIDATE
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
