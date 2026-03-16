import { motion } from 'framer-motion';
import { Plane, Loader2, Sparkles, MapPin, Navigation, Calendar, Wallet } from 'lucide-react';

const TripForm = ({ formData, setFormData, handleSubmit, loading }) => {
  
  const interestOptions = [
    { id: "Food", label: "Foodie 🍜", color: "from-orange-400 to-red-500", shadow: "shadow-orange-500/40" },
    { id: "History", label: "History 🏛️", color: "from-amber-700 to-orange-600", shadow: "shadow-amber-500/40" },
    { id: "Nature", label: "Nature 🌿", color: "from-green-400 to-emerald-600", shadow: "shadow-emerald-500/40" },
    { id: "Adventure", label: "Adventure 🧗", color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/40" },
    { id: "Relaxation", label: "Relax 🧖‍♀️", color: "from-pink-400 to-rose-500", shadow: "shadow-pink-500/40" },
    { id: "Nightlife", label: "Party 🍸", color: "from-purple-500 to-violet-600", shadow: "shadow-purple-500/40" },
  ];

  const toggleInterest = (interest) => {
    let currentInterests = formData.interests ? formData.interests.split(', ') : [];
    currentInterests = currentInterests.filter(i => i !== "");
    if (currentInterests.includes(interest)) {
      currentInterests = currentInterests.filter(i => i !== interest);
    } else {
      currentInterests.push(interest);
    }
    setFormData({ ...formData, interests: currentInterests.join(', ') });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      // 🔥 FIX: Forced dark mode background, reduced padding (p-6) so it fits on screen
      className="relative p-6 sm:p-8 bg-[#0a0f1c]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden w-full"
    >
      {/* Aesthetic Top Inner Glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>

      {/* 🔥 FIX: Reduced gaps to make form more compact */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 relative z-10">
        
        {/* LEFT SIDE: Inputs */}
        <div className="space-y-4">
          
          {/* Origin */}
          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1 opacity-90 flex items-center gap-1.5">
              Origin
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
              {/* 🔥 FIX: Reduced padding (py-3) and text-sm to stop cut-offs */}
              <input 
                className="w-full bg-black/40 border border-white/10 pl-10 pr-3 py-3 rounded-xl text-sm font-medium text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all placeholder:text-gray-500 shadow-inner" 
                placeholder="Where from?" 
                value={formData.source}
                onChange={e => setFormData({...formData, source: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1 opacity-90 flex items-center gap-1.5">
              Destination
            </label>
            <div className="relative">
              <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                className="w-full bg-black/40 border border-white/10 pl-10 pr-3 py-3 rounded-xl text-sm font-medium text-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all placeholder:text-gray-500 shadow-inner" 
                placeholder="Where to?" 
                value={formData.destination}
                onChange={e => setFormData({...formData, destination: e.target.value})} 
                required 
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            {/* Days */}
            <div className="space-y-1.5 w-1/3 group">
              <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1 opacity-90 flex items-center gap-1.5">
                Days
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="number" 
                  min="1"
                  max="30"
                  className="w-full bg-black/40 border border-white/10 pl-9 pr-2 py-3 rounded-xl text-sm font-medium text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all placeholder:text-gray-500 shadow-inner" 
                  placeholder="Count" 
                  value={formData.days}
                  onChange={e => setFormData({...formData, days: e.target.value})} 
                  required 
                />
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-1.5 w-2/3 group">
              <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1 opacity-90 flex items-center gap-1.5">
                Budget
              </label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                <select 
                  className="w-full bg-black/40 border border-white/10 pl-9 pr-6 py-3 rounded-xl text-sm font-medium text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all cursor-pointer appearance-none shadow-inner truncate" 
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                >
                  <option value="Medium" className="text-gray-900">Moderate</option>
                  <option value="Cheap" className="text-gray-900">Budget</option>
                  <option value="Luxury" className="text-gray-900">Luxury</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Smart Tags */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1 opacity-90 flex items-center gap-1.5">
            Trip Vibe <Sparkles className="w-3 h-3 text-yellow-400" />
          </label>
          
          <div className="flex flex-wrap gap-2.5 content-start">
            {interestOptions.map((opt) => {
              const isSelected = formData.interests.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleInterest(opt.id)}
                  className={`
                    relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 border
                    ${isSelected 
                      ? `bg-gradient-to-br ${opt.color} text-white border-transparent ${opt.shadow} shadow-md translate-y-[-2px]` 
                      : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          <div className="mt-2 relative group">
             <input 
              className="w-full bg-transparent border-b border-white/10 p-2 text-xs text-white focus:border-cyan-400 outline-none transition-all placeholder:text-gray-500 font-medium" 
              placeholder="+ Add custom interest..." 
              onChange={e => toggleInterest(e.target.value)} 
            />
          </div>
        </div>

        {/* 🔥 FIX: Shorter button height (h-[54px]) so it fits on screen */}
        <button 
          type="submit" 
          disabled={loading} 
          className="col-span-1 md:col-span-2 mt-4 h-[54px] relative group overflow-hidden rounded-xl font-bold text-base text-white shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 bg-[length:200%_auto] animate-gradient"></div>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out skew-x-12"></div>
          
          <div className="relative flex justify-center items-center gap-2 z-10">
            {loading ? (
               <>
                 <Loader2 className="animate-spin w-5 h-5" /> 
                 <span>Orchestrating...</span>
               </>
            ) : (
               <>
                 <span>Generate Itinerary</span>
                 <Plane className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </>
            )}
          </div>
        </button>
      </form>
    </motion.div>
  );
};

export default TripForm;