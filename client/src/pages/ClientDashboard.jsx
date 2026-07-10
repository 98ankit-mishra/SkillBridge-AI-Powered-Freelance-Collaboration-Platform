import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [myProjects, setMyProjects] = useState([]);

  useEffect(() => {
    api.get('/workspaces/mine').then(res => setWorkspaces(res.data.data)).catch(console.error);
    api.get('/projects/mine').then(res => setMyProjects(res.data.data)).catch(console.error);
  }, []);

  return (
    <div className="flex-grow flex flex-col font-sans">
      <section className="bg-background border-b-4 border-black px-6 py-20 relative swiss-noise">
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-[var(--color-swiss-red)] text-white font-bold px-3 py-1 text-lg tracking-widest">01.</span>
              <h2 className="font-bold text-sm tracking-widest uppercase bg-white px-2">ENTERPRISE OVERVIEW</h2>
            </div>
            <h1 className="font-black text-6xl md:text-8xl tracking-tighter uppercase mb-6 leading-none">DASHBOARD.</h1>
            <p className="font-bold text-2xl uppercase tracking-wide opacity-80">WELCOME BACK, {user?.name}.</p>
          </div>
          <Link to="/post-project" className="bg-[var(--color-swiss-red)] text-white px-10 py-6 font-black uppercase tracking-widest text-lg border-4 border-[var(--color-swiss-red)] hover:bg-white hover:text-black hover:border-black transition-colors text-center">
            POST NEW REQUIREMENT
          </Link>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 border-4 border-black mb-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-12 border-b-4 md:border-b-0 md:border-r-4 border-black bg-muted group hover:bg-[var(--color-swiss-red)] hover:text-white transition-colors cursor-default swiss-dots">
              <h3 className="font-bold uppercase tracking-widest text-sm mb-4">POSTED REQUIREMENTS</h3>
              <p className="text-8xl font-black">{myProjects.length}</p>
            </div>
            <div className="p-12 bg-white group hover:bg-black hover:text-white transition-colors cursor-default">
              <h3 className="font-bold uppercase tracking-widest text-sm mb-4 opacity-50 group-hover:opacity-100">ACTIVE WORKSPACES</h3>
              <p className="text-8xl font-black opacity-20 group-hover:opacity-100">{workspaces.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mb-10">
            <h3 className="font-black text-4xl tracking-tighter uppercase">YOUR REQUIREMENTS</h3>
            <span className="flex-grow h-2 bg-black opacity-10"></span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {myProjects.map(proj => (
              <div key={proj._id} className="bg-white p-10 border-4 border-black flex flex-col justify-between group hover:bg-[var(--color-swiss-red)] transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-6 border-b-4 border-black group-hover:border-white pb-6 transition-colors">
                    <h4 className="font-black text-3xl uppercase tracking-tighter w-3/4 group-hover:text-white">{proj.title}</h4>
                    <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="font-medium text-lg opacity-80 line-clamp-3 mb-10 group-hover:text-white">{proj.description}</p>
                </div>
                <Link to={`/projects/${proj._id}/manage`} className="block w-full border-4 border-black bg-black text-white px-6 py-5 text-sm font-black uppercase tracking-widest text-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-colors">
                  MANAGE APPLICANTS
                </Link>
              </div>
            ))}
            {myProjects.length === 0 && (
              <div className="col-span-1 lg:col-span-2 border-4 border-black p-16 text-center bg-muted swiss-diagonal">
                <p className="font-bold uppercase tracking-widest text-lg mb-8 bg-white inline-block px-4 py-2 border-2 border-black">NO REQUIREMENTS POSTED.</p>
                <Link to="/post-project" className="block mx-auto max-w-xs bg-black text-white px-8 py-5 text-sm font-black uppercase tracking-widest hover:bg-[var(--color-swiss-red)] transition-colors border-4 border-black">
                  INITIALIZE PROJECT
                </Link>
              </div>
            )}
          </div>
          
          {workspaces.length > 0 && (
            <>
              <div className="flex items-center gap-6 mb-10 mt-20">
                <h3 className="font-black text-4xl tracking-tighter uppercase">ACTIVE WORKSPACES</h3>
                <span className="flex-grow h-2 bg-black opacity-10"></span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {workspaces.map(ws => (
                  <div key={ws._id} className="bg-white p-10 border-4 border-black flex flex-col justify-between group hover:bg-black transition-colors">
                    <div>
                      <div className="flex justify-between items-start mb-6 border-b-4 border-black group-hover:border-[var(--color-swiss-red)] pb-6 transition-colors">
                        <h4 className="font-black text-3xl uppercase tracking-tighter w-3/4 group-hover:text-[var(--color-swiss-red)]">{ws.project.title}</h4>
                        <span className="bg-[var(--color-swiss-red)] text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                          {ws.project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="font-medium text-lg opacity-80 mb-10 group-hover:text-white">
                        ENGAGED WITH: <strong className="font-black text-[var(--color-swiss-red)]">{ws.student.name}</strong>
                      </p>
                    </div>
                    <Link to={`/workspace/${ws._id}`} className="block w-full border-4 border-[var(--color-swiss-red)] bg-[var(--color-swiss-red)] text-white px-6 py-5 text-sm font-black uppercase tracking-widest text-center hover:bg-white hover:text-black hover:border-white transition-colors">
                      ENTER WORKSPACE
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
