import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects').then(res => setProjects(res.data.data.items)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-24 font-bold uppercase tracking-widest text-sm">LOADING DATA...</div>;

  return (
    <div className="flex-grow flex flex-col font-sans">
      <section className="bg-background border-b-4 border-black px-6 py-20 relative swiss-diagonal">
        <div className="absolute inset-0 swiss-grid-pattern opacity-40 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[var(--color-swiss-red)] text-white font-bold px-3 py-1 text-lg tracking-widest">02.</span>
              <h2 className="font-bold text-sm tracking-widest uppercase bg-white px-2">REGISTRY</h2>
            </div>
            <h1 className="font-black text-6xl md:text-8xl tracking-tighter uppercase mb-4 leading-none mix-blend-multiply">REQUIREMENTS</h1>
          </div>
          <div className="border-l-4 border-black pl-6 max-w-sm">
            <p className="font-bold text-lg leading-tight uppercase tracking-wide">
              A curated registry of active requirements from our enterprise partners.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted flex-grow px-6 py-16 swiss-noise">
        <div className="max-w-7xl mx-auto">
          {projects.length === 0 ? (
            <div className="border-4 border-black p-24 text-center bg-white">
              <p className="font-bold uppercase tracking-widest text-lg">NO OPEN REQUIREMENTS AT THIS TIME.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.map(proj => (
                <Link key={proj._id} to={`/projects/${proj._id}`} className="block bg-white p-10 border-4 border-black hover:bg-black hover:text-white transition-colors duration-150 group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6 border-b-4 border-black group-hover:border-[var(--color-swiss-red)] pb-6 transition-colors">
                      <h2 className="text-4xl font-black uppercase tracking-tighter pr-4 leading-none">{proj.title}</h2>
                      <span className="bg-[var(--color-swiss-red)] text-white px-3 py-2 text-sm font-black tracking-widest whitespace-nowrap">
                        ${proj.budget}
                      </span>
                    </div>
                    <p className="font-medium text-lg opacity-80 line-clamp-3 mb-8 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {proj.skillsRequired.map(skill => (
                        <span key={skill} className="border-2 border-black group-hover:border-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm uppercase tracking-widest">
                        CLIENT: {proj.client.name}
                      </span>
                      <span className="w-10 h-10 border-2 border-black group-hover:border-white flex items-center justify-center font-bold text-xl group-hover:bg-[var(--color-swiss-red)] group-hover:border-[var(--color-swiss-red)] transition-all transform group-hover:rotate-45">
                        +
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
