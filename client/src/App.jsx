import { useState, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Plane } from 'lucide-react';
import Navbar from './components/Navbar';
import TripForm from './components/TripForm';
import HistoryList from './components/HistoryList';
import Itinerary from './components/Itinerary';
import Footer from './components/Footer';

function App() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  // 1. UPDATED STATE: Added 'source'
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
      // 2. UPDATED LOGIC: Sending the new formData (including source) to the backend
      const res = await axios.post(`${API_URL}/api/generate-trip`, formData);
      setTrip(res.data);
    } catch (error) {
      setError("Failed to generate trip. Please try again!");
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
    <div className="min-h-screen relative font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 🚀 3. UPDATED LOADING OVERLAY: Shows both locations while loading */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col justify-center items-center text-white">
           <Plane className="w-20 h-20 text-white animate-bounce" />
           <h2 className="text-3xl font-bold mt-8 text-center px-4">
             Designing your dream trip from {formData.source} to {formData.destination}...
           </h2>
        </div>
      )}

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/20 z-20"></div>
        <img 
          src={bgImage} 
          alt="Travel Background" 
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="relative z-30 max-w-5xl mx-auto px-6 pt-10 pb-20">
        <Navbar view={view} setView={setView} fetchHistory={fetchHistory} />
        
        {view === 'history' && (
          <HistoryList history={history} setTrip={setTrip} setView={setView} handleDelete={handleDelete} />
        )}

        {view === 'home' && (
          <>
            {!trip && (
              <div className="text-center mb-12 animate-fade-in-down">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tight">
                  Where will you <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">wander next?</span>
                </h1>
                <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
                  Enter your route and let AI curate your perfect adventure in seconds.
                </p>
              </div>
            )}
            
            <TripForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} loading={loading} />
            
            {error && (
              <div className="mt-6 bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-100 p-4 rounded-2xl text-center">
                {error}
              </div>
            )}

            {trip && (
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
            )}
          </>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default App;