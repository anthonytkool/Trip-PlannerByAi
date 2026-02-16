import { MapPin, Calendar, Heart, Trash2 } from 'lucide-react';

const HistoryList = ({ history, setTrip, setView, handleDelete }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-sm mb-10">Trip History 📜</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {history.map((item) => (
          <div 
            key={item._id} 
            className="glass-card relative group p-8 rounded-[2rem] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer border border-white/60" 
            onClick={() => { setTrip(item); setView('home'); }}
          >
            {/* Delete Button */}
            <button 
              onClick={(e) => handleDelete(e, item._id)}
              className="absolute top-5 right-5 bg-white/80 p-2.5 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm z-10"
              title="Delete Trip"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-extrabold text-slate-800 pr-8 leading-tight">{item.trip_name}</h3>
                <span className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border border-emerald-200/50">{item.total_cost || "N/A"}</span>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-indigo-100">
                <MapPin className="w-4 h-4" /> {item.destination}
              </span>
              <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-orange-100">
                <Calendar className="w-4 h-4" /> {item.days} Days
              </span>
              {item.interests && (
                <span className="flex items-center gap-1.5 bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-pink-100">
                  <Heart className="w-4 h-4" /> {item.interests}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;