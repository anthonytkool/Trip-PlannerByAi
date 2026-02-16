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

// Schema - Added 'source' to the database so your history stays accurate
const tripSchema = new mongoose.Schema({
    source: String,
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
    // 1. UPDATED: Destructuring 'source' from request body
    const { source, destination, days, budget, interests } = req.body;

    try {
        // 2. POWER PROMPT: Added Source logic and Nearest Hub instructions
        const prompt = `
            Plan a ${days}-day trip FROM ${source} TO ${destination} with a ${budget} budget. 
            Interests: ${interests}.
            
            IMPORTANT INSTRUCTIONS:
            1. **TRANSPORT LOGIC**: 
               - Calculate all travel options specifically starting FROM ${source} TO ${destination}.
               - NEAREST HUB RULE: If ${destination} does not have its own airport or railway station (e.g., Dandeli), find the NEAREST major hub (airport/station) and include the taxi or bus connection from that hub to ${destination}.
               - Provide approximate ticket costs for each mode.

            2. **CURRENCY LOGIC**: 
               - If ${source} and ${destination} are in INDIA, show ALL costs in Indian Rupees (₹).
               - If either is outside India, show ALL costs in USD ($).
            
            3. **BUDGET ACCURACY**:
               - The "total_estimated_cost" MUST include the transport cost from ${source} to ${destination} and back.

            4. Output PURE JSON only.
            
            STRICT JSON STRUCTURE:
            {
              "trip_name": "Creative Trip Title",
              "total_estimated_cost": "Total Trip Cost (e.g., ₹20,000 - ₹25,000)",
              "weather_tip": "Short weather advice",
              
              "travel_options": [
                { 
                  "type": "Flight/Train/Bus/Cab", 
                  "route": "Detailed path (e.g., ${source} -> Nearest Hub -> ${destination})", 
                  "duration": "Total travel time", 
                  "estimated_cost": "Cost (₹ or $)", 
                  "booking_link": "https://www.google.com/search?q=travel+from+${source}+to+${destination}"
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
            source, // Saved source
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