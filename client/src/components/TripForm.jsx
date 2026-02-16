import { Plane, Loader2, Sparkles, MapPin } from 'lucide-react';

const TripForm = ({ formData, setFormData, handleSubmit, loading }) => {
  
  // ✨ The Pre-defined interests with Emojis
  const interestOptions = [
    { id: "Food", label: "Foodie 🍜", color: "from-orange-400 to-red-500" },
    { id: "History", label: "History 🏛️", color: "from-amber-700 to-orange-600" },
    { id: "Nature", label: "Nature 🌿", color: "from-green-400 to-emerald-600" },
    { id: "Adventure", label: "Adventure 🧗", color: "from-blue-500 to-indigo-600" },
    { id: "Relaxation", label: "Relax 🧖‍♀️", color: "from-pink-300 to-rose-400" },
    { id: "Nightlife", label: "Party 🍸", color: "from-purple-500 to-violet-600" },
  ];

  // ✨ Toggle Logic (Adds/Removes interests from the string)
  const toggleInterest = (interest) => {
    let currentInterests = formData.interests ? formData.interests.split(', ') : [];
    
    // Clean up empty strings
    currentInterests = currentInterests.filter(i => i !== "");

    if (currentInterests.includes(interest)) {
      // Remove if already there
      currentInterests = currentInterests.filter(i => i !== interest);
    } else {
      // Add if new
      currentInterests.push(interest);
    }
    
    setFormData({ ...formData, interests: currentInterests.join(', ') });
  };

  return (
    <div className="glass-panel p-8 rounded-[2rem] mb-12 transform transition-all duration-500 hover:shadow-2xl border border-white/40 relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Left Side: Inputs */}
        <div className="space-y-6">
          
          {/* NEW: Starting Location (Source) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-900 tracking-wider uppercase ml-1 opacity-70 flex items-center gap-1">
              Starting From <MapPin className="w-3 h-3 text-indigo-500" />
            </label>
            <input 
              className="w-full bg-white/50 border border-white/60 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 backdrop-blur-sm" 
              placeholder="e.g. Mumbai, New York..." 
              value={formData.source}
              onChange={e => setFormData({...formData, source: e.target.value})} 
              required 
            />
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-900 tracking-wider uppercase ml-1 opacity-70">Where to?</label>
            <input 
              className="w-full bg-white/50 border border-white/60 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 backdrop-blur-sm" 
              placeholder="e.g. Tokyo, Paris..." 
              value={formData.destination}
              onChange={e => setFormData({...formData, destination: e.target.value})} 
              required 
            />
          </div>
          
          <div className="flex gap-4">
              {/* Days */}
            <div className="space-y-2 w-1/2">
              <label className="text-xs font-bold text-indigo-900 tracking-wider uppercase ml-1 opacity-70">Duration</label>
              <input 
                type="number" 
                className="w-full bg-white/50 border border-white/60 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all backdrop-blur-sm" 
                placeholder="3" 
                value={formData.days}
                onChange={e => setFormData({...formData, days: e.target.value})} 
                required 
              />
            </div>

            {/* Budget */}
            <div className="space-y-2 w-1/2">
              <label className="text-xs font-bold text-indigo-900 tracking-wider uppercase ml-1 opacity-70">Budget</label>
              <select 
                className="w-full bg-white/50 border border-white/60 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer appearance-none backdrop-blur-sm" 
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
              >
                <option value="Medium">Moderate Budget</option>
                <option value="Cheap">Low Budget</option>
                <option value="Luxury">Luxury Budget</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Smart Tags */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-indigo-900 tracking-wider uppercase ml-1 opacity-70 flex items-center gap-2">
            Select Interests <Sparkles className="w-3 h-3 text-yellow-500" />
          </label>
          
          <div className="flex flex-wrap gap-3 content-start">
            {interestOptions.map((opt) => {
              const isSelected = formData.interests.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleInterest(opt.id)}
                  className={`
                    relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 border
                    ${isSelected 
                      ? `bg-gradient-to-r ${opt.color} text-white shadow-lg border-transparent translate-y-[-2px]` 
                      : "bg-white/40 text-gray-600 border-white/50 hover:bg-white/60"
                    }
                  `}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          {/* Hidden text input for manual typing if needed */}
           <input 
            className="w-full bg-transparent border-b border-gray-300/50 p-2 text-sm text-gray-600 focus:border-indigo-500 outline-none mt-2 placeholder:text-gray-400/70" 
            placeholder="+ Add custom interest..." 
            onChange={e => toggleInterest(e.target.value)} 
          />
        </div>

        {/* Full Width Submit */}
        <button 
          type="submit" 
          disabled={loading} 
          className="col-span-1 md:col-span-2 h-[64px] bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient text-white text-lg rounded-2xl font-bold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-3 mt-4"
          style={{ backgroundSize: '200% auto' }}
        >
          {loading ? (
             <span className="flex items-center gap-2">
               <Loader2 className="animate-spin w-5 h-5" /> Designing your trip...
             </span>
          ) : (
             <>Generate My Adventure <Plane className="w-5 h-5" /></>
          )}
        </button>
      </form>
    </div>
  );
};

export default TripForm;