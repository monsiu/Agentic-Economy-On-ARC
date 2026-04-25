require('dotenv').config();
const axios = require('axios');

async function askGemini(question) {
  const response = await axios.post(
    'https://api.aimlapi.com/v1/chat/completions',
    {
      model: 'gemini-2.0-flash',
      messages: [
        {
          role: 'system',
          content: 'You are an AI agent operating in the Agentic Economy on Arc blockchain. You answer questions about payments, USDC, nanopayments, and machine-to-machine commerce. Keep answers under 3 sentences.'
        },
        {
          role: 'user',
          content: question
        }
      ],
      max_tokens: 200
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.AIML_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = { askGemini };
