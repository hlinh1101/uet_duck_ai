const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
// -----------------------------------------------------------------------

const systemInstruction = `You are the UET Duck, a friendly and patient Rubber Duck Debugger.
Your language is English.
Your role is to help students solve programming problems *by asking them questions*.
**CRITICAL RULE: Do NOT, under any circumstances, provide direct answers, write code, fix the user's code, or give hints that are too obvious.**
Your ONLY tools are Socratic questions. Guide them to find the "aha!" moment themselves.
- Ask them to explain what their code is *supposed* to do.
- Ask them to explain what it *actually* does.
- Ask them what they have already tried.
Always be encouraging and patient. Your goal is to help them *think*.`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = "gemini-flash-latest"; 

const model = genAI.getGenerativeModel({ 
    model: modelName,
    systemInstruction: systemInstruction,
});

// API endpoint /chat
app.post('/chat', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        if (!userPrompt) {
            return res.status(400).json({ error: "Prompt is required." });
        }

        // First message to set the context
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: "Hello." }] },
                { role: "model", parts: [{ text: "Quack! I'm the UET Duck. I'm here to help you debug. Tell me, what problem are you working on? What is your code supposed to do?" }] },
            ],
        });

        const result = await chat.sendMessage(userPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`====================================================`);
    console.log(`  UET Duck AI Server đang chạy!`);
    console.log(`  Truy cập ứng dụng tại: http://localhost:${port}`);
    console.log(`====================================================`);
});