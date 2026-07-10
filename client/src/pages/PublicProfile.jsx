import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function PublicProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/profiles/public/${id}`)
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center p-24 font-bold uppercase tracking-widest text-sm">LOADING IDENTITY...</div>;
  if (!data || !data.user) return <div className="text-center p-24 font-bold uppercase tracking-widest text-sm border-4 border-black max-w-xl mx-auto mt-16">IDENTITY NOT FOUND.</div>;

  const { user, profile, projects, reviews } = data;

  return (
    <div className="flex-grow flex flex-col font-sans">
      <section className="bg-background border-b-4 border-black px-6 py-20 relative swiss-noise">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-8">
             <span className="bg-[var(--color-swiss-red)] text-white font-bold px-3 py-1 text-lg tracking-widest">PRO.</span>
             <h2 className="font-bold text-sm tracking-widest uppercase bg-white px-2">PUBLIC IDENTITY</h2>
             
             {currentUser && currentUser.role !== 'admin' && currentUser._id !== id && (
               <button 
                 onClick={() => {
                   const reason = window.prompt('Provide a reason for flagging this identity:');
                   if (reason) {
                     api.post('/reports', { targetType: 'user', targetId: id, reason })
                       .then(() => alert('Report submitted successfully.'))
                       .catch(() => alert('Failed to submit report.'));
                   }
                 }}
                 className="ml-auto bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-swiss-red)] transition-colors"
               >
                 FLAG PROFILE
               </button>
             )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-10 bg-white p-12 border-4 border-black">
            <div className="w-48 h-48 bg-black flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-black">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover grayscale mix-blend-screen opacity-90" />
              ) : (
                <span className="text-white text-7xl font-black">{user.name.charAt(0)}</span>
              )}
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-4">{user.name}</h1>
              <span className="inline-block bg-[var(--color-swiss-red)] text-white px-4 py-2 font-black uppercase tracking-widest text-lg w-max mb-6">
                {user.role}
              </span>
              
              {user.role === 'student' && profile?.bio && (
                <p className="font-medium text-xl leading-relaxed max-w-2xl opacity-80 border-l-4 border-[var(--color-swiss-red)] pl-6">
                  {profile.bio}
                </p>
              )}
              {user.role === 'client' && profile?.description && (
                <p className="font-medium text-xl leading-relaxed max-w-2xl opacity-80 border-l-4 border-black pl-6">
                  {profile.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-20">
          
          {user.role === 'student' && (
            <>
              {/* COMPETENCIES */}
              <div>
                <h3 className="font-black text-4xl tracking-tighter uppercase flex items-center gap-6 mb-8">
                  COMPETENCIES
                  <span className="flex-grow h-1 bg-black opacity-10"></span>
                </h3>
                <div className="flex flex-wrap gap-4">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, i) => (
                      <span key={i} className="border-4 border-black px-6 py-3 font-bold text-lg uppercase tracking-widest hover:bg-[var(--color-swiss-red)] hover:text-white hover:border-[var(--color-swiss-red)] transition-colors">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm font-bold uppercase tracking-widest opacity-50">NO COMPETENCIES LISTED.</span>
                  )}
                </div>
              </div>

              {/* TRUST METRICS (REVIEWS) */}
              <div>
                <h3 className="font-black text-4xl tracking-tighter uppercase flex items-center gap-6 mb-8">
                  TRUST METRICS ({reviews.length})
                  <span className="flex-grow h-1 bg-black opacity-10"></span>
                </h3>
                {reviews.length === 0 ? (
                  <div className="bg-muted border-4 border-black p-12 text-center swiss-dots">
                    <p className="font-bold text-lg uppercase tracking-widest">NO REVIEWS ACCUMULATED YET.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviews.map(rev => (
                      <div key={rev._id} className="bg-white border-4 border-black p-10 flex flex-col group hover:bg-black hover:text-white transition-colors">
                        <div className="flex justify-between items-end mb-6 border-b-4 border-black group-hover:border-[var(--color-swiss-red)] pb-6 transition-colors">
                          <span className="text-4xl font-black text-[var(--color-swiss-red)] tracking-widest">
                            {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-medium text-xl leading-relaxed mb-8 flex-grow">"{rev.comment}"</p>
                        <p className="text-sm font-black uppercase tracking-widest">
                          EVALUATED BY: <span className="text-[var(--color-swiss-red)]">{rev.fromUser?.name || 'UNKNOWN'}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PROJECT PORTFOLIO */}
              <div>
                <h3 className="font-black text-4xl tracking-tighter uppercase flex items-center gap-6 mb-8">
                  COMPLETED PROJECTS ({projects.length})
                  <span className="flex-grow h-1 bg-black opacity-10"></span>
                </h3>
                {projects.length === 0 ? (
                  <div className="bg-muted border-4 border-black p-12 text-center swiss-diagonal">
                    <p className="font-bold text-lg uppercase tracking-widest">NO COMPLETED PROJECTS IN PORTFOLIO.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {projects.map(proj => (
                      <div key={proj._id} className="bg-white border-4 border-black p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-muted transition-colors">
                        <div>
                          <h4 className="font-black text-3xl uppercase tracking-tighter mb-2">{proj.title}</h4>
                          <p className="text-sm font-bold uppercase tracking-widest opacity-70">DELIVERED TO: {proj.client?.name}</p>
                        </div>
                        <Link to={`/projects/${proj._id}`} className="bg-black text-white px-6 py-4 font-black uppercase tracking-widest text-sm hover:bg-[var(--color-swiss-red)] transition-colors whitespace-nowrap">
                          VIEW PROJECT
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {user.role === 'client' && (
            <div className="bg-muted border-4 border-black p-12 swiss-dots text-center">
              <h3 className="font-black text-3xl uppercase tracking-tighter mb-4">ENTERPRISE CLIENT</h3>
              <p className="font-bold text-lg uppercase tracking-widest opacity-70">
                {profile?.companyName || 'CONFIDENTIAL IDENTIFIER'}
              </p>
              {profile?.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" className="inline-block mt-8 bg-[var(--color-swiss-red)] text-white px-8 py-4 font-black uppercase tracking-widest border-4 border-[var(--color-swiss-red)] hover:bg-black hover:border-black transition-colors">
                  VISIT EXTERNAL PORTAL
                </a>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
