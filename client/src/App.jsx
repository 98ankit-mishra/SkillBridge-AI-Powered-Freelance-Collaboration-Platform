import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Projects from './pages/Projects';
import PostProject from './pages/PostProject';
import ProjectDetails from './pages/ProjectDetails';
import ManageProject from './pages/ManageProject';
import Workspace from './pages/Workspace';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationBell from './components/NotificationBell';

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted flex flex-col font-sans swiss-noise">
      <header className="bg-background border-b-4 border-black sticky top-0 z-50">
        <div className="mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link to="/" className="font-sans font-black text-3xl tracking-tighter text-black uppercase hover:text-[var(--color-swiss-red)] transition-colors duration-150 ease-linear">SKILLBRIDGE.</Link>
          <nav className="flex space-x-8 items-center">
            <Link to="/projects" className="text-black hover:text-[var(--color-swiss-red)] font-bold uppercase text-sm tracking-widest transition-colors duration-150 ease-linear">PROJECTS</Link>
            {user ? (
              <div className="flex items-center space-x-6 border-l-2 border-black pl-6">
                <Link to="/profile" className="flex items-center space-x-3 group">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 object-cover border-2 border-black group-hover:border-[var(--color-swiss-red)] transition-colors duration-150 ease-linear" />
                  ) : (
                    <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black font-black text-lg group-hover:border-[var(--color-swiss-red)] group-hover:text-[var(--color-swiss-red)] transition-colors duration-150 ease-linear">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-bold text-black uppercase tracking-widest hidden sm:block group-hover:text-[var(--color-swiss-red)] transition-colors duration-150 ease-linear">{user.name}</span>
                </Link>
                <Link to={user.role === 'admin' ? '/admin-dashboard' : user.role === 'student' ? '/student-dashboard' : '/client-dashboard'} className="text-black hover:text-[var(--color-swiss-red)] font-bold uppercase text-sm tracking-widest transition-colors duration-150 ease-linear">DASHBOARD</Link>
                {user.role !== 'admin' && <NotificationBell />}
                <button onClick={logout} className="text-black hover:text-white hover:bg-[var(--color-swiss-red)] font-bold uppercase text-sm tracking-widest px-4 py-2 border-2 border-transparent transition-colors duration-150 ease-linear">LOGOUT</button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 border-l-2 border-black pl-6">
                <Link to="/login" className="text-black hover:text-[var(--color-swiss-red)] font-bold uppercase text-sm tracking-widest transition-colors duration-150 ease-linear">LOGIN</Link>
                <Link to="/register" className="bg-[var(--color-swiss-red)] text-white px-6 py-3 uppercase tracking-widest text-sm font-bold hover:bg-black hover:text-white transition-colors duration-150 ease-linear">REGISTER</Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/post-project" element={<ProtectedRoute allowedRoles={['client']}><PostProject /></ProtectedRoute>} />
          <Route path="/projects/:id/manage" element={<ProtectedRoute allowedRoles={['client']}><ManageProject /></ProtectedRoute>} />
          <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/client-dashboard" element={<ProtectedRoute allowedRoles={['client']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/workspace/:id" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<PublicProfile />} />
        </Routes>
      </main>
      
      <footer className="bg-background text-black border-t-4 border-black py-16 text-center mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto px-6 text-left">
          <div>
             <h2 className="font-black text-4xl tracking-tighter mb-4 uppercase">SkillBridge</h2>
             <p className="font-bold text-sm tracking-widest uppercase">INTERNATIONAL TYPOGRAPHIC SYSTEM.</p>
          </div>
          <div className="md:text-right flex flex-col justify-end mt-8 md:mt-0">
             <p className="font-bold text-sm uppercase tracking-widest opacity-50">&copy; {new Date().getFullYear()} SKILLBRIDGE.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
