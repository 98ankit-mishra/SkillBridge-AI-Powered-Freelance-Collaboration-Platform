import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 relative swiss-noise bg-muted min-h-[calc(100vh-80px)]">
      <div className="absolute inset-0 swiss-grid-pattern opacity-50 pointer-events-none"></div>
      
      <div className="w-full max-w-lg bg-background border-4 border-black p-12 relative z-10">
        <div className="mb-12 border-b-4 border-black pb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-[var(--color-swiss-red)] text-white font-bold px-2 py-1 text-sm tracking-widest">01.</span>
            <h2 className="font-bold text-sm tracking-widest uppercase">AUTHENTICATION</h2>
          </div>
          <h1 className="font-black text-6xl tracking-tighter uppercase leading-none">LOG IN</h1>
        </div>
        
        {error && (
          <div className="bg-[var(--color-swiss-red)] text-white p-4 mb-8 text-sm font-bold uppercase tracking-widest border-2 border-black">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2">EMAIL ADDRESS</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-2 border-black p-4 bg-transparent text-lg font-bold focus:border-[var(--color-swiss-red)] focus:outline-none transition-colors duration-150"
              placeholder="JANE@EXAMPLE.COM"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2">PASSWORD</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-2 border-black p-4 bg-transparent text-lg font-bold focus:border-[var(--color-swiss-red)] focus:outline-none transition-colors duration-150"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-black text-white font-black uppercase tracking-widest text-lg py-5 border-4 border-black hover:bg-[var(--color-swiss-red)] hover:border-[var(--color-swiss-red)] transition-colors duration-150 mt-8"
          >
            AUTHENTICATE
          </button>
        </form>
        
        <div className="mt-12 text-left pt-6">
          <p className="text-sm font-bold uppercase tracking-widest">
            NO ACCOUNT YET? 
            <Link to="/register" className="ml-2 text-[var(--color-swiss-red)] hover:bg-[var(--color-swiss-red)] hover:text-white px-2 py-1 transition-colors duration-150 border-2 border-transparent hover:border-[var(--color-swiss-red)]">
              REGISTER NOW
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
