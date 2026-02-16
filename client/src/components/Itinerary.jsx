import { useState } from 'react';
import { MapPin, Clock, Navigation, Download, Edit2, Save, XCircle, Plane, Train, Bus, CheckSquare, Sun } from 'lucide-react';

const Itinerary = ({ trip, isEditing, setIsEditing, editedPlan, handleActivityChange, saveChanges, printRef, handleDownloadPDF }) => {
  const [activeTab, setActiveTab] = useState('itinerary');

  // 🛠️ HELPER: Safely extract text from the activity (whether it's string or object)
  const getActivityText = (activity) => {
    if (!activity) return "";
    if (typeof activity === 'string') return activity;
    // Handle object case (Time, Activity, Location)
    if (typeof activity === 'object') {
      return `${activity.time ? activity.time + ': ' : ''}${activity.activity || ''} ${activity.location ? '(' + activity.location + ')' : ''}`;
    }
    return "";
  };

  const openMap = (activity) => {
    const text = getActivityText(activity);
    if (!text) return;
    
    // Clean up the text for a better search
    const cleanQuery = text.replace(/Morning:|Afternoon:|Evening:|Night:/gi, '').trim();
    
    // ✅ FIXED: Correct Google Maps Search URL
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanQuery + " " + (trip.destination || ""))}`;
    window.open(mapUrl, '_blank');
  };

  if (!trip) return null;

  return (
    <div className="glass-panel p-8 rounded-[2rem] animate-fade-in-up relative" ref={printRef}>
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-white/30 pb-6">
        <div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 to-slate-700 mb-2">
            {trip.trip_name || "My Trip"} 🌍
          </h2>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-600">
             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200">💰 {trip.total_cost || "N/A"}</span>
             {trip.weather_tip && (
               <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                 <Sun size={14}/> {trip.weather_tip}
               </span>
             )}
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-3 no-print">
          {isEditing ? (
            <>
              <button onClick={saveChanges} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all">
                <Save className="w-4 h-4" /> Save
              </button>
              <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-xl font-bold transition-all">
                <XCircle className="w-4 h-4" /> Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-white/50 hover:bg-white text-indigo-700 border border-indigo-200 px-4 py-2 rounded-xl font-bold transition-all">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all">
                <Download className="w-4 h-4" /> PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-6 mb-8 border-b border-white/20">
        <button 
          onClick={() => setActiveTab('itinerary')}
          className={`pb-3 text-lg font-bold transition-all ${activeTab === 'itinerary' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          📅 Daily Plan
        </button>
        <button 
          onClick={() => setActiveTab('packing')}
          className={`pb-3 text-lg font-bold transition-all ${activeTab === 'packing' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          🧳 Packing List
        </button>
      </div>

      {/* --- ITINERARY CONTENT --- */}
      {activeTab === 'itinerary' && (
        <div className="space-y-8 animate-fade-in">
           
           {/* Travel Options */}
           {trip.travel_options && Array.isArray(trip.travel_options) && trip.travel_options.length > 0 && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {trip.travel_options.map((option, idx) => (
                <div key={idx} className="bg-white/60 border border-white/50 p-4 rounded-2xl flex flex-col justify-between hover:bg-white transition-all shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        {option.type === "Flight" ? <Plane size={18}/> : option.type === "Train" ? <Train size={18}/> : <Bus size={18}/>}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{option.type}</h4>
                        <p className="text-xs text-gray-500">{option.duration}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-700 mb-1">{option.route}</p>
                      <p className="text-sm font-bold text-green-700">{option.estimated_cost}</p>
                    </div>
                    {option.booking_link && (
                      <a href={option.booking_link} target="_blank" rel="noreferrer" className="mt-3 text-center w-full block bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Check Availability ↗
                      </a>
                    )}
                </div>
              ))}
            </div>
           )}

           {/* Daily Timeline */}
           <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-transparent hidden md:block"></div>
              
              {(isEditing ? editedPlan : (trip.daily_plan || [])).map((day, dayIndex) => (
                <div key={dayIndex} className="relative pl-0 md:pl-12 group mb-8">
                  <div className="absolute left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow-md hidden md:block group-hover:scale-125 transition-transform duration-300"></div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm border border-indigo-200">Day {day.day}</span>
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {day.activities.map((activity, actIndex) => (
                      <div 
                        key={actIndex} 
                        onClick={() => !isEditing && openMap(activity)}
                        className={`
                          p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4
                          ${isEditing ? 'bg-white border-indigo-200 ring-2 ring-indigo-50' : 'bg-white/60 border-white/60 hover:bg-white hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group/card'}
                        `}
                      >
                        <div className="mt-1 p-2 rounded-full bg-indigo-50 text-indigo-500 shrink-0">
                          {actIndex === 0 ? <Clock className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        </div>
                        <div className="w-full">
                          {isEditing ? (
                            <textarea
                              value={getActivityText(activity)}
                              onChange={(e) => handleActivityChange(dayIndex, actIndex, e.target.value)}
                              className="w-full bg-transparent border-b border-indigo-200 focus:border-indigo-500 outline-none text-slate-700 font-medium resize-none h-auto"
                              rows={2}
                            />
                          ) : (
                            <>
                              <p className="text-slate-700 font-medium leading-relaxed">{getActivityText(activity)}</p>
                              <span className="text-xs text-indigo-400 font-bold mt-2 flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                <Navigation className="w-3 h-3" /> Click to view on map
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* --- PACKING LIST CONTENT --- */}
      {activeTab === 'packing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {trip.packing_list && Array.isArray(trip.packing_list) && trip.packing_list.length > 0 ? trip.packing_list.map((category, idx) => (
            <div key={idx} className="bg-white/60 p-6 rounded-2xl border border-indigo-100 shadow-sm">
              <h4 className="font-bold text-lg text-indigo-800 mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5" /> {category.category}
              </h4>
              <ul className="space-y-3">
                {category.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-center gap-3 text-slate-700 bg-white/50 p-2 rounded-lg">
                    <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 accent-indigo-500 cursor-pointer"/>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )) : (
            <div className="col-span-2 text-center py-10 bg-white/30 rounded-2xl border border-dashed border-slate-300">
               <p className="text-slate-500 font-medium italic">
                 ✨ No packing list found for this trip. <br/>
                 <span className="font-bold text-indigo-600">Generate a NEW trip</span> to see your personalized packing list!
               </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Itinerary;