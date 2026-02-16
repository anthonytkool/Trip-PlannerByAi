require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function check() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Checking available models...");

    try {
        // This connects to Google and asks for the list
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
        );
        const data = await response.json();

        if (data.models) {
            console.log("\n✅ SUCCESS! Here are the models you can use:");
            // Filter for only "generateContent" models
            const validModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
            validModels.forEach(m => console.log(`   - "${m.name.replace('models/', '')}"`));
        } else {
            console.log("❌ Error:", data);
        }
    } catch (error) {
        console.error("❌ Failed to connect:", error.message);
    }
}

check();