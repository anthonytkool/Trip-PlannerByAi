import { useState, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import TripForm from './components/TripForm';
import HistoryList from './components/HistoryList';
import Itinerary from './components/Itinerary';
import Footer from './components/Footer';
import Globe from './components/Globe';

function App() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  const [formData, setFormData] = useState({ 
    source: '', 
    destination: '', 
    days: '', 
    budget: 'Moderate Budget', 
    interests: '' 
  });
  
  const [trip, setTrip] = useState(null);
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('home');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState([]);
  
  const STATIC_IMAGE = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop";
  const [bgImage, setBgImage] = useState(STATIC_IMAGE);

  const printRef = useRef();

  const fetchUnsplashImage = async (destination) => {
    if (!UNSPLASH_KEY) return STATIC_IMAGE;
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { 
          query: `${destination} travel landscape aesthetic`, 
          per_page: 1, 
          orientation: 'landscape' 
        },
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
      });
      return response.data.results[0]?.urls?.regular || STATIC_IMAGE;
    } catch (error) {
      return STATIC_IMAGE;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTrip(null);
    setIsEditing(false);
    
    const newBg = await fetchUnsplashImage(formData.destination);
    setBgImage(newBg);

    try {
      // 120-second timeout to handle Render cold starts
      const res = await axios.post(`${API_URL}/api/generate-trip`, formData, {
        timeout: 120000 
      });
      setTrip(res.data);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setError("The AI is taking a bit longer to think. Please wait a moment and try again.");
      } else {
        setError("Server is waking up or quota reached. Please try again in a minute!");
      }
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/trips`);
      setHistory(res.data);
      setView('history');
      setIsEditing(false);
    } catch (error) { console.error("Failed to fetch history"); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this trip?")) return;
    try {
      await axios.delete(`${API_URL}/api/trips/${id}`);
      setHistory(history.filter(item => item._id !== id));
    } catch (error) { alert("Failed to delete trip"); }
  };

  const startEditing = (value) => {
    if(value) setEditedPlan(JSON.parse(JSON.stringify(trip.daily_plan)));
    setIsEditing(value);
  };

  const handleActivityChange = (dayIndex, activityIndex, newValue) => {
    const newPlan = [...editedPlan];
    newPlan[dayIndex].activities[activityIndex] = newValue;
    setEditedPlan(newPlan);
  };

  const saveChanges = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/trips/${trip._id}`, { daily_plan: editedPlan });
      setTrip(res.data);
      setIsEditing(false);
    } catch (err) { alert("Failed to save changes!"); }
  };

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if(!element) return;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const data = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${trip.destination}_Itinerary.pdf`);
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-cyan-500 selection:text-white">
      
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col justify-center items-center text-white">
           <Plane className="w-20 h-20 text-cyan-400 animate-bounce" />
           <h2 className="text-3xl font-bold mt-8 text-center px-4">
             Designing your dream trip from {formData.source} to {formData.destination}...
           </h2>
        </div>
      )}

      {/* 🖼️ BACKGROUND STACK */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img 
          src={bgImage} 
          alt="Travel Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 transition-opacity duration-1000" 
        />
        <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-black/30 z-10 pointer-events-none"></div>
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-6 pt-6 pb-12">
        <Navbar view={view} setView={setView} fetchHistory={fetchHistory} />
        
        {view === 'history' && (
          <HistoryList history={history} setTrip={setTrip} setView={setView} handleDelete={handleDelete} />
        )}

        {view === 'home' && (
          <>
            {!trip ? (
              // ✨ COMPACT SPLIT-SCREEN LAYOUT
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-4 md:mt-8">
                
                {/* LEFT SIDE: Heading & Form */}
                <div className="flex flex-col justify-center relative">
                  
                  {/* Breathing Aurora Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 blur-[80px] rounded-full animate-pulse pointer-events-none z-0"></div>

                  <div className="relative z-10">
                    <motion.div 
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="text-left mb-5"
                    >
                      <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight leading-tight">
                        Where will you <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 animate-gradient bg-[length:200%_auto]">wander next?</span>
                      </h1>
                      <p className="text-base md:text-lg text-gray-300 max-w-md font-light leading-relaxed">
                        Enter your route and let AI curate your perfect adventure in seconds.
                      </p>
                    </motion.div>
                    
                    <TripForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} loading={loading} />
                    
                    {error && (
                      <div className="mt-4 bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-100 p-3 rounded-xl text-left text-sm">
                        {error}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE: 3D Globe */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="relative h-[350px] lg:h-[600px] w-full flex items-center justify-center pointer-events-none"
                >
                  <Globe />
                </motion.div>

              </div>
            ) : (
              <div className="mt-8">
                <Itinerary 
                  trip={trip} 
                  isEditing={isEditing} 
                  setIsEditing={startEditing} 
                  editedPlan={editedPlan} 
                  handleActivityChange={handleActivityChange} 
                  saveChanges={saveChanges} 
                  printRef={printRef} 
                  handleDownloadPDF={handleDownloadPDF} 
                />
              </div>
            )}
          </>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default App;