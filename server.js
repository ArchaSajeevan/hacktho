const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Function to get response from OpenAI API
async function getLLMResponse(userMessage) {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4", // You can also use "gpt-3.5-turbo" if needed
                messages: [{ role: "system", content: "You are a friendly mental health support assistant." },
                           { role: "user", content: userMessage }],
                temperature: 0.7
            },
            {
                headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
        return "I'm sorry, but something went wrong. Please try again later.";
    }
}

// Handle chatbot requests
app.post("/chatbot", async (req, res) => {
    const userMessage = req.body.message;
    const reply = await getLLMResponse(userMessage);
    res.json({ reply });
});

// Start the server
app.listen(3000, () => {
    console.log("✅ Chatbot server running on http://localhost:3000");
});
require("dotenv").config();
const apiKey = process.env.OPENAI_API_KEY;
console.log("API Key Loaded:", apiKey ? "Yes" : "No");
