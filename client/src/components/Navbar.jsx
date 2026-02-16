import { Sparkles, History, ArrowLeft } from 'lucide-react';

const Navbar = ({ view, setView, fetchHistory }) => {
  return (
    <div className="flex justify-between items-center mb-12">
      <div 
        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg cursor-pointer" 
        onClick={() => setView('home')}
      >
        <Sparkles className="w-4 h-4 text-yellow-300" />
        <span className="text-white text-sm font-medium tracking-wide">GEMINI TRAVEL AI</span>
      </div>
      
      {view === 'home' ? (
        <button 
          onClick={fetchHistory} 
          className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-xl text-indigo-700 font-bold hover:bg-white transition shadow-lg text-sm"
        >
          <History className="w-4 h-4" /> My Past Trips
        </button>
      ) : (
        <button 
          onClick={() => setView('home')} 
          className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-xl text-white font-bold hover:bg-indigo-700 transition shadow-lg text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Planner
        </button>
      )}
    </div>
  );
};

export default Navbar;