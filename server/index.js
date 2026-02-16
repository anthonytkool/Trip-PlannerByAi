const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));

// Schema
const tripSchema = new mongoose.Schema({
    destination: String,
    days: Number,
    budget: String,
    interests: String,
    trip_name: String,
    total_cost: String,
    daily_plan: Array,
    travel_options: Array,
    packing_list: Array,
    weather_tip: String,
    createdAt: { type: Date, default: Date.now }
});

const Trip = mongoose.model('Trip', tripSchema);

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// Route: Generate Trip
app.post('/api/generate-trip', async(req, res) => {
    const { destination, days, budget, interests } = req.body;

    try {
        // 🧠 SMART CURRENCY & TRANSPORT PROMPT
        const prompt = `
            Plan a ${days}-day trip to ${destination} with a ${budget} budget. Interests: ${interests}.
            
            IMPORTANT INSTRUCTIONS:
            1. **CURRENCY LOGIC**: 
               - Detect the country of "${destination}".
               - If it is inside INDIA, show ALL costs in Indian Rupees (Example: ₹5,000).
               - If it is OUTSIDE India, show ALL costs in USD (Example: $100).
            
            2. **TRANSPORT LOGIC**: 
               - If ${destination} has no commercial airport, DO NOT suggest Flights.
               - If no train station, DO NOT suggest Trains.
            
            3. Output PURE JSON only.
            
            STRICT JSON STRUCTURE:
            {
              "trip_name": "Creative Trip Title",
              "total_estimated_cost": "Total Cost (e.g., ₹15,000 - ₹20,000 OR $500 - $700)",
              "weather_tip": "Short weather advice",
              
              "travel_options": [
                { 
                  "type": "Flight/Train/Bus/Cab", 
                  "route": "Origin -> Destination", 
                  "duration": "Duration", 
                  "estimated_cost": "Cost (in ₹ or $)", 
                  "booking_link": "https://www.google.com/search?q=travel+to+${destination}"
                }
              ],
              
              "packing_list": [
                { "category": "Clothing", "items": ["Item 1", "Item 2"] },
                { "category": "Essentials", "items": ["Item 1", "Item 2"] }
              ],
              
              "daily_plan": [
                { 
                  "day": 1, 
                  "activities": [
                     "Morning: Activity 1",
                     "Afternoon: Activity 2",
                     "Evening: Activity 3"
                  ] 
                }
              ]
            }
        `;

        const result = await model.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const tripData = JSON.parse(text);

        const newTrip = new Trip({
            destination,
            days,
            budget,
            interests,
            trip_name: tripData.trip_name,
            total_cost: tripData.total_estimated_cost,
            daily_plan: tripData.daily_plan,
            travel_options: tripData.travel_options,
            packing_list: tripData.packing_list,
            weather_tip: tripData.weather_tip
        });

        await newTrip.save();
        res.json(newTrip);

    } catch (error) {
        console.error("❌ Error generating trip:", error);
        res.status(500).json({ error: 'Failed to generate trip. Try again!' });
    }
});

// Other Routes
app.get('/api/trips', async(req, res) => {
    try {
        const trips = await Trip.find().sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) { res.status(500).json({ error: 'Error' }); }
});

app.delete('/api/trips/:id', async(req, res) => {
    try {
        await Trip.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ error: 'Error' }); }
});

app.put('/api/trips/:id', async(req, res) => {
    try {
        const t = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(t);
    } catch (error) { res.status(500).json({ error: 'Error' }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));