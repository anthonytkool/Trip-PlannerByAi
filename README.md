# Trip-PlannerByAi 🤖🌏
> I forked this amazing starter kit to accelerate the development of my SE Asia Travel AI. By leveraging this solid foundation, I can focus on building the specific AI logic for Thailand/Vietnam tourism.

AI Travel Planner (MERN + Gemini AI)
An intelligent, full-stack travel planning application that curates personalized itineraries using Generative AI. This project solves real-world travel logistics by calculating routes, discovering transport hubs, and localized budgeting.

🔗 Live Demo
Frontend: https://ai-travel-planner-ashen.vercel.app
Backend: https://ai-travel-planner-92hk.onrender.com

✨ Key Features
📍 Source-to-Destination Logic: Generates routes and travel plans based specifically on your starting location.

🚆 Nearest Hub Discovery: Intelligently identifies the closest railway stations or airports for remote destinations (e.g., Alnavar for Dandeli).

💰 Smart Budgeting: Automatically detects region to show costs in Indian Rupees (₹) for Indian trips and USD ($) for international travel.

📅 AI-Generated Itineraries: Detailed day-wise activities, packing lists, and localized weather advice powered by Gemini 1.5 Flash.

📄 PDF Export: One-click download to save your travel plan as a professional PDF document.

💾 Persistent History: Securely save and manage your past trip searches using MongoDB Atlas.

🛠️ Technical Stack
Frontend: React.js, Tailwind CSS, Lucide React (Icons), Vite.

Backend: Node.js, Express.js.

Database: MongoDB Atlas (Mongoose ORM).

AI Engine: Google Gemini AI (Generative AI SDK).

Deployment: Vercel (Frontend), Render (Backend).

Results:
<img width="1900" height="1136" alt="Screenshot 2026-02-17 235550" src="https://github.com/user-attachments/assets/95e71f2b-1992-486a-898a-eab4bc385a04" />
<img width="1821" height="1036" alt="Screenshot 2026-02-16 125506" src="https://github.com/user-attachments/assets/dd08aa4e-128e-4bea-a847-d6cf81e4ea40" />



⚙️ Local Setup Instructions
Clone the Repository:

Bash
git clone https://github.com/Shashank240924/Ai-travel-planner.git
cd Ai-travel-planner
Environment Variables:

Backend (.env): Create in /server

Code snippet
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_google_ai_key
PORT=5000
Frontend (.env): Create in /client

Code snippet
VITE_API_URL=http://localhost:5000
VITE_UNSPLASH_ACCESS_KEY=your_key
Run the Project:

Server: cd server && npm install && npm start
Client: cd client && npm install && npm run dev

👨‍💻 Author
Shashank G

GitHub: @Shashank240924

Education: Final-year Computer Science Engineer.
