import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex-grow flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative py-24 md:py-40 px-6 border-b-4 border-black bg-muted swiss-noise overflow-hidden">
        <div className="absolute inset-0 swiss-grid-pattern pointer-events-none opacity-40"></div>
        <div className="absolute top-10 right-10 w-64 h-64 border-4 border-[var(--color-swiss-red)] rounded-full opacity-20 pointer-events-none swiss-diagonal"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="col-span-1 md:col-span-8">
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-[var(--color-swiss-red)] text-white font-bold px-3 py-1 text-lg tracking-widest">01.</span>
              <h2 className="font-bold text-sm tracking-widest uppercase">PLATFORM INTRODUCTION</h2>
            </div>
            <h1 className="font-black text-6xl md:text-8xl lg:text-[10rem] tracking-tighter uppercase leading-[0.85] mb-8 text-black mix-blend-multiply">
              SKILL<br />BRIDGE.
            </h1>
          </div>
          
          <div className="col-span-1 md:col-span-4 border-l-4 border-black pl-8 mb-8">
            <p className="text-xl md:text-2xl font-bold max-w-sm leading-tight mb-12 uppercase tracking-wide">
              Connecting visionary enterprises with exceptional talent. Objective communication. Absolute clarity.
            </p>
            <div className="flex flex-col gap-4">
              <Link to="/projects" className="bg-black text-white px-8 py-6 uppercase tracking-widest text-sm font-black hover:bg-[var(--color-swiss-red)] hover:text-white border-4 border-black hover:border-[var(--color-swiss-red)] transition-colors duration-150 text-center w-full">
                EXPLORE PROJECTS
              </Link>
              <Link to="/register" className="bg-transparent text-black px-8 py-6 uppercase tracking-widest text-sm font-black hover:bg-[var(--color-swiss-red)] hover:text-white border-4 border-black hover:border-[var(--color-swiss-red)] transition-colors duration-150 text-center w-full">
                JOIN PLATFORM
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-0 px-0 border-b-4 border-black">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="p-16 border-b-4 md:border-b-0 md:border-r-4 border-black bg-white hover:bg-[var(--color-swiss-red)] hover:text-white transition-colors duration-150 group">
            <div className="w-16 h-16 border-4 border-black rounded-full mb-12 group-hover:border-white group-hover:bg-black transition-all duration-150 flex items-center justify-center">
              <div className="w-4 h-4 bg-black group-hover:bg-white rounded-full"></div>
            </div>
            <h2 className="text-7xl font-black tracking-tighter mb-4 opacity-20 group-hover:opacity-40">01</h2>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">POST REQUIREMENTS</h3>
            <p className="font-medium text-lg leading-snug">Enterprises define absolute requirements and expected outcomes. Clarity over ambiguity.</p>
          </div>
          
          <div className="p-16 border-b-4 md:border-b-0 md:border-r-4 border-black bg-muted swiss-dots hover:bg-[var(--color-swiss-red)] hover:text-white transition-colors duration-150 group">
            <div className="w-16 h-16 border-4 border-black mb-12 group-hover:border-white group-hover:bg-black transition-all duration-150 transform group-hover:rotate-45"></div>
            <h2 className="text-7xl font-black tracking-tighter mb-4 opacity-20 group-hover:opacity-40">02</h2>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">SELECT TALENT</h3>
            <p className="font-medium text-lg leading-snug">Review architectural proposals. Select the most competent individual. No compromises.</p>
          </div>
          
          <div className="p-16 bg-white hover:bg-black hover:text-white transition-colors duration-150 group">
            <div className="w-16 h-16 border-4 border-black mb-12 flex flex-col justify-between group-hover:border-white">
              <div className="h-4 border-b-4 border-black group-hover:border-white"></div>
              <div className="h-4 border-t-4 border-black group-hover:border-white"></div>
            </div>
            <h2 className="text-7xl font-black tracking-tighter mb-4 opacity-20 group-hover:opacity-40">03</h2>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">EXECUTE</h3>
            <p className="font-medium text-lg leading-snug">Real-time collaboration. Secure file handoffs. Absolute accountability.</p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-black text-white py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 swiss-diagonal opacity-20"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-[var(--color-swiss-red)] text-white font-bold px-3 py-1 text-lg tracking-widest">04.</span>
            <h2 className="font-bold text-sm tracking-widest uppercase">COMMENCE</h2>
          </div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-12 leading-none">
            ESTABLISH YOUR PRESENCE.
          </h2>
          <Link to="/register" className="inline-block bg-[var(--color-swiss-red)] text-white px-12 py-8 uppercase tracking-widest text-lg font-black hover:bg-white hover:text-black border-4 border-[var(--color-swiss-red)] hover:border-white transition-colors duration-150">
            INITIALIZE
          </Link>
        </div>
      </section>
    </div>
  );
}
