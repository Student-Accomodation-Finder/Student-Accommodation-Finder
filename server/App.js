const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenAI } = require("@google/genai");

require('dotenv').config();

// middelware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Initializing Gemini AI Client
const ai = new GoogleGenAI({});

// Chat Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    // Define System Instructions to scope the AI strictly to Kenya Student Housing
    const systemInstruction = `
      You are NestQuest AI, an expert student housing assistant in Kenya.
      Your goal is to help university students find housing, understand rent costs (in KES), 
      compare locations relative to campus gates (e.g., JKUAT Juja Gate A/C, KU Kahawa Sukari, UoN Main/Chiromo, Strathmore Madaraka, USIU Gate A/B), 
      and answer questions about utilities, safety, deposits, and landlord norms in Kenya.
      
      Guidelines:
      - Always format prices in Kenyan Shillings (KES).
      - Be warm, helpful, encouraging, and clear.
      - Use bullet points for recommendations.
      - Strictly ground all advice within the context of Kenya student living.
      - CRITICAL CONTEXT RULE: Maintain continuous context from previous turns. If the user asks a follow-up (e.g. providing a budget or preference after discussing a specific campus like UoN Chiromo), direct your answer SPECIFICALLY to that previously discussed campus/location.
      - DO NOT repeat greetings (e.g. "Jambo!", "Welcome to NestQuest AI") or re-introduce yourself on follow-up messages within an ongoing conversation.
      - If a user asks something completely unrelated to housing or student life in Kenya, politely redirect them back to finding accommodation in Kenya.
    `;

    // Construct full prompt context or use chat model
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ success: true, reply: response.text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ success: false, error: "AI Assistant is currently offline." });
  }
});

//routes
const propertyRoutes = require('./routes/propertyRoutes');
const roommateRoutes = require('./routes/roommates');

app.use('/api/properties', propertyRoutes);
app.use('/api/roommates', roommateRoutes);
app.get('/api/test', (req, res) => {
  res.json({ ok: true });
});

// database
mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log('Database connection is ready');
    //server
    app.listen(process.env.PORT, ()=> {
        console.log(`server is running https://localhost:${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log(err);
})