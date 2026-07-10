import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/workspaces/mine'),
      api.get('/applications/mine')
    ]).then(([wsRes, appRes]) => {
      setWorkspaces(wsRes.data.data);
      setApplications(appRes.data.data);
    }).catch(console.error);
  }, []);

  const activeApplications = applications.filter(app => app.status === 'pending').length;
  const activeEngagements = workspaces.filter(ws => ws.project.status === 'in_progress').length;
  const completedProjects = workspaces.filter(ws => ws.project.status === 'completed').length;

  return (
    <div className="flex-grow flex flex-col font-sans">
      <section className="bg-background border-b-4 border-black px-6 py-20 relative swiss-noise">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-[var(--color-swiss-red)] text-white font-bold px-3 py-1 text-lg tracking-widest">01.</span>
            <h2 className="font-bold text-sm tracking-widest uppercase bg-white px-2">OPERATIONAL OVERVIEW</h2>
          </div>
          <h1 className="font-black text-6xl md:text-8xl tracking-tighter uppercase mb-6 leading-none">DASHBOARD.</h1>
          <p className="font-bold text-2xl uppercase tracking-wide opacity-80 max-w-2xl">WELCOME BACK, {user?.name}.</p>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 border-4 border-black mb-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-12 border-b-4 md:border-b-0 md:border-r-4 border-black bg-muted group hover:bg-[var(--color-swiss-red)] hover:text-white transition-colors cursor-default swiss-dots">
              <h3 className="font-bold uppercase tracking-widest text-sm mb-4">ACTIVE APPLICATIONS</h3>
              <p className="text-8xl font-black">{activeApplications}</p>
            </div>
            <div className="p-12 border-b-4 md:border-b-0 md:border-r-4 border-black bg-white group hover:bg-black hover:text-white transition-colors cursor-default">
              <h3 className="font-bold uppercase tracking-widest text-sm mb-4 opacity-50 group-hover:opacity-100">ACTIVE ENGAGEMENTS</h3>
              <p className="text-8xl font-black opacity-20 group-hover:opacity-100">{activeEngagements}</p>
            </div>
            <div className="p-12 bg-white group hover:bg-[var(--color-swiss-red)] hover:text-white transition-colors cursor-default">
              <h3 className="font-bold uppercase tracking-widest text-sm mb-4 opacity-50 group-hover:opacity-100">COMPLETED PROJECTS</h3>
              <p className="text-8xl font-black opacity-20 group-hover:opacity-100">{completedProjects}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mb-10">
            <h3 className="font-black text-4xl tracking-tighter uppercase">ACTIVE WORKSPACES</h3>
            <span className="flex-grow h-2 bg-black opacity-10"></span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {workspaces.map(ws => (
              <Link key={ws._id} to={`/workspace/${ws._id}`} className="block bg-white p-10 border-4 border-black hover:bg-black hover:text-white transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-swiss-red)] transform translate-x-12 -translate-y-12 rotate-45 group-hover:scale-150 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="font-black text-3xl uppercase tracking-tighter w-3/4">{ws.project.title}</h4>
                    <span className="bg-[var(--color-swiss-red)] text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                      {ws.project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="font-bold text-sm uppercase tracking-widest mb-10 opacity-70 group-hover:opacity-100">CLIENT: {ws.client.name}</p>
                  <div className="inline-block bg-transparent text-black border-4 border-black px-8 py-4 text-sm font-black uppercase tracking-widest group-hover:bg-white group-hover:text-black group-hover:border-white transition-colors">
                    ENTER WORKSPACE
                  </div>
                </div>
              </Link>
            ))}
            {workspaces.length === 0 && (
              <div className="col-span-1 lg:col-span-2 border-4 border-black p-16 text-center bg-muted swiss-diagonal">
                <p className="font-bold uppercase tracking-widest text-lg mb-8 bg-white inline-block px-4 py-2 border-2 border-black">NO ACTIVE WORKSPACES.</p>
                <Link to="/projects" className="block mx-auto max-w-xs bg-black text-white px-8 py-5 text-sm font-black uppercase tracking-widest hover:bg-[var(--color-swiss-red)] transition-colors border-4 border-black">
                  BROWSE PROJECTS
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
