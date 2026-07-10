import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, reports

  const loadData = () => {
    if (activeTab === 'overview') {
      api.get('/admin/stats').then(res => setStats(res.data.data)).catch(console.error);
    } else if (activeTab === 'users') {
      api.get('/admin/users').then(res => setUsers(res.data.data)).catch(console.error);
    } else if (activeTab === 'reports') {
      api.get('/admin/reports').then(res => setReports(res.data.data)).catch(console.error);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleUserStatus = async (id, status) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, status } : u));
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleReportStatus = async (id, status) => {
    try {
      await api.patch(`/admin/reports/${id}`, { status });
      setReports(prev => prev.map(r => r._id === id ? { ...r, status } : r));
    } catch (err) {
      alert('Error updating report');
    }
  };

  if (!stats && activeTab === 'overview') return <div className="p-24 text-center font-black uppercase tracking-widest text-sm">INITIALIZING OMNI-PANEL...</div>;

  return (
    <div className="flex-grow flex flex-col font-sans bg-muted swiss-noise">
      <section className="bg-black text-white px-6 py-20 border-b-8 border-[var(--color-swiss-red)] relative">
        <div className="max-w-7xl mx-auto">
           <h2 className="font-bold text-sm tracking-widest uppercase bg-[var(--color-swiss-red)] text-white px-2 w-max mb-4">SYSTEM ADMINISTRATOR</h2>
           <h1 className="font-black text-6xl md:text-8xl tracking-tighter uppercase leading-none">OVERSEER.</h1>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {['overview', 'users', 'reports'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-6 font-black uppercase tracking-widest text-lg border-r-4 border-black transition-colors ${activeTab === tab ? 'bg-[var(--color-swiss-red)] text-white' : 'hover:bg-black hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="p-6 md:p-12 flex-grow">
        <div className="max-w-7xl mx-auto">
          
          {activeTab === 'overview' && stats && (
            <div className="space-y-12">
              <h3 className="font-black text-5xl uppercase tracking-tighter border-b-8 border-black pb-4 mb-10">TELEMETRY</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Users Stat */}
                <div className="bg-white border-4 border-black p-10 flex flex-col justify-between">
                  <h4 className="font-bold text-sm uppercase tracking-widest opacity-60 mb-8">TOTAL IDENTITIES</h4>
                  <div>
                    <span className="text-8xl font-black">{stats.users.total}</span>
                    <div className="flex gap-4 mt-6">
                      <div className="bg-black text-white px-4 py-2 font-bold text-xs uppercase tracking-widest">
                        {stats.users.students} STU
                      </div>
                      <div className="bg-[var(--color-swiss-red)] text-white px-4 py-2 font-bold text-xs uppercase tracking-widest">
                        {stats.users.clients} CLI
                      </div>
                    </div>
                  </div>
                </div>

                {/* Projects Stat */}
                <div className="bg-white border-4 border-black p-10 flex flex-col justify-between">
                  <h4 className="font-bold text-sm uppercase tracking-widest opacity-60 mb-8">ACTIVE PROJECTS</h4>
                  <div>
                    <span className="text-8xl font-black">{stats.projects.in_progress}</span>
                    <div className="mt-6 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs font-bold tracking-widest uppercase">
                        <span>OPEN</span> <span>{stats.projects.open}</span>
                      </div>
                      <div className="w-full bg-muted h-2"><div className="bg-black h-2" style={{ width: `${(stats.projects.open / (stats.projects.open + stats.projects.completed + stats.projects.in_progress || 1)) * 100}%` }}></div></div>
                      
                      <div className="flex justify-between items-center text-xs font-bold tracking-widest uppercase mt-2">
                        <span>COMPLETED</span> <span>{stats.projects.completed}</span>
                      </div>
                      <div className="w-full bg-muted h-2"><div className="bg-[var(--color-swiss-red)] h-2" style={{ width: `${(stats.projects.completed / (stats.projects.open + stats.projects.completed + stats.projects.in_progress || 1)) * 100}%` }}></div></div>
                    </div>
                  </div>
                </div>
                
                {/* Reports Stat */}
                <div className="bg-white border-4 border-[var(--color-swiss-red)] p-10 flex flex-col justify-between swiss-diagonal">
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-8 bg-white px-2 w-max border-2 border-black">OPEN REPORTS</h4>
                  <div>
                    <span className="text-8xl font-black text-[var(--color-swiss-red)] bg-white px-2">{stats.reports.open}</span>
                    {stats.reports.open > 0 && (
                      <button onClick={() => setActiveTab('reports')} className="block mt-6 bg-black text-white font-black uppercase text-sm tracking-widest py-3 px-6 hover:bg-[var(--color-swiss-red)] transition-colors border-2 border-black">
                        MODERATE NOW
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="font-black text-5xl uppercase tracking-tighter border-b-8 border-black pb-4 mb-10">IDENTITY REGISTRY</h3>
              <div className="bg-white border-4 border-black overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black text-white text-sm font-bold tracking-widest uppercase">
                      <th className="p-6">NAME</th>
                      <th className="p-6">EMAIL</th>
                      <th className="p-6 border-x-4 border-white">ROLE</th>
                      <th className="p-6">STATUS</th>
                      <th className="p-6 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b-4 border-black hover:bg-muted transition-colors">
                        <td className="p-6 font-black uppercase text-lg">{u.name}</td>
                        <td className="p-6 font-medium text-sm">{u.email}</td>
                        <td className="p-6 font-black uppercase tracking-widest text-xs border-x-4 border-black">{u.role}</td>
                        <td className="p-6">
                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest text-white ${u.status === 'active' ? 'bg-black' : u.status === 'suspended' ? 'bg-yellow-600' : 'bg-[var(--color-swiss-red)]'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-6 text-right space-x-2">
                          {u.role !== 'admin' && (
                            <>
                              {u.status !== 'active' && <button onClick={() => handleUserStatus(u._id, 'active')} className="bg-black text-white text-xs font-bold uppercase px-3 py-2 hover:bg-white hover:text-black border-2 border-black transition-colors">ACTIVATE</button>}
                              {u.status !== 'suspended' && <button onClick={() => handleUserStatus(u._id, 'suspended')} className="bg-yellow-400 text-black text-xs font-bold uppercase px-3 py-2 border-2 border-transparent hover:border-black transition-colors">SUSPEND</button>}
                              {u.status !== 'banned' && <button onClick={() => handleUserStatus(u._id, 'banned')} className="bg-[var(--color-swiss-red)] text-white text-xs font-bold uppercase px-3 py-2 border-2 border-[var(--color-swiss-red)] hover:bg-white hover:text-black transition-colors">BAN</button>}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h3 className="font-black text-5xl uppercase tracking-tighter border-b-8 border-[var(--color-swiss-red)] pb-4 mb-10">MODERATION QUEUE</h3>
              {reports.length === 0 ? (
                <div className="bg-white border-4 border-black p-16 text-center font-bold uppercase tracking-widest text-xl">QUEUE IS EMPTY.</div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {reports.map(r => (
                    <div key={r._id} className="bg-white border-4 border-black p-8 flex flex-col md:flex-row gap-8 justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex gap-4 mb-4">
                           <span className={`px-3 py-1 font-black text-xs tracking-widest uppercase text-white ${r.status === 'open' ? 'bg-[var(--color-swiss-red)]' : 'bg-black'}`}>
                             {r.status}
                           </span>
                           <span className="px-3 py-1 bg-muted border-2 border-black font-bold text-xs tracking-widest uppercase">
                             TARGET: {r.targetType}
                           </span>
                        </div>
                        <p className="font-medium text-xl leading-relaxed mb-6 border-l-4 border-[var(--color-swiss-red)] pl-4">{r.reason}</p>
                        <p className="text-sm font-bold tracking-widest uppercase opacity-60">
                          REPORTED BY: {r.reportedBy.name} ({r.reportedBy.role}) ON {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs font-medium opacity-50 mt-1">TARGET ID: {r.targetId}</p>
                      </div>
                      <div className="flex flex-col gap-3 min-w-[200px]">
                        {r.status === 'open' && (
                          <>
                            <button onClick={() => handleReportStatus(r._id, 'reviewed')} className="w-full bg-black text-white font-black uppercase text-sm tracking-widest py-4 hover:bg-[var(--color-swiss-red)] transition-colors">MARK REVIEWED</button>
                            <button onClick={() => handleReportStatus(r._id, 'dismissed')} className="w-full bg-transparent text-black border-4 border-black font-black uppercase text-sm tracking-widest py-3 hover:bg-black hover:text-white transition-colors">DISMISS</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
