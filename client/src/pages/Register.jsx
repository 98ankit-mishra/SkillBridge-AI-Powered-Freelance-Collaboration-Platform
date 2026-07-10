import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="flex-grow flex items-center justify-center p-6 relative swiss-noise bg-muted min-h-[calc(100vh-80px)] py-16">
      <div className="absolute inset-0 swiss-grid-pattern opacity-50 pointer-events-none"></div>
      
      <div className="w-full max-w-xl bg-background border-4 border-black p-12 relative z-10">
        <div className="mb-12 border-b-4 border-black pb-8">
           <div className="flex items-center gap-4 mb-4">
            <span className="bg-[var(--color-swiss-red)] text-white font-bold px-2 py-1 text-sm tracking-widest">01.</span>
            <h2 className="font-bold text-sm tracking-widest uppercase">REGISTRATION</h2>
          </div>
          <h1 className="font-black text-6xl tracking-tighter uppercase leading-none">JOIN</h1>
        </div>
        
        {error && (
          <div className="bg-[var(--color-swiss-red)] text-white p-4 mb-8 text-sm font-bold uppercase tracking-widest border-2 border-black">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-0 border-2 border-black">
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'student'})}
              className={`py-4 text-sm font-black uppercase tracking-widest transition-colors duration-150 border-r-2 border-black ${formData.role === 'student' ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-[var(--color-swiss-red)] hover:text-white'}`}
            >
              STUDENT
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'client'})}
              className={`py-4 text-sm font-black uppercase tracking-widest transition-colors duration-150 ${formData.role === 'client' ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-[var(--color-swiss-red)] hover:text-white'}`}
            >
              CLIENT
            </button>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2">FULL NAME</label>
            <input 
              type="text" name="name" required value={formData.name} onChange={handleChange}
              className="w-full border-2 border-black p-4 bg-transparent text-lg font-bold focus:border-[var(--color-swiss-red)] focus:outline-none transition-colors duration-150"
              placeholder="JANE DOE"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2">EMAIL ADDRESS</label>
            <input 
              type="email" name="email" required value={formData.email} onChange={handleChange}
              className="w-full border-2 border-black p-4 bg-transparent text-lg font-bold focus:border-[var(--color-swiss-red)] focus:outline-none transition-colors duration-150"
              placeholder="JANE@EXAMPLE.COM"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2">PASSWORD</label>
            <input 
              type="password" name="password" required value={formData.password} onChange={handleChange}
              className="w-full border-2 border-black p-4 bg-transparent text-lg font-bold focus:border-[var(--color-swiss-red)] focus:outline-none transition-colors duration-150"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-black text-white font-black uppercase tracking-widest text-lg py-5 border-4 border-black hover:bg-[var(--color-swiss-red)] hover:border-[var(--color-swiss-red)] transition-colors duration-150 mt-8"
          >
            CREATE ACCOUNT
          </button>
        </form>
        
        <div className="mt-12 text-left pt-6">
          <p className="text-sm font-bold uppercase tracking-widest">
            ALREADY REGISTERED? 
            <Link to="/login" className="ml-2 text-[var(--color-swiss-red)] hover:bg-[var(--color-swiss-red)] hover:text-white px-2 py-1 transition-colors duration-150 border-2 border-transparent hover:border-[var(--color-swiss-red)]">
              LOG IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
