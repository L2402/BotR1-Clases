const axios = require('axios');

async function sendPromptToR1({ systemPrompt, userPrompt }) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.MODEL || 'deepseek-chat';

  if (!apiKey) {
    const error = new Error('Falta la variable DEEPSEEK_API_KEY en el archivo .env.');
    error.statusCode = 500;
    throw error;
  }

  const messages = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  messages.push({ role: 'user', content: userPrompt });

  const response = await axios.post(
    'https://api.deepseek.com/chat/completions',
    {
      model,
      messages,
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const reply = response.data?.choices?.[0]?.message?.content || '';

  return {
    model,
    reply: reply.trim(),
    raw: response.data
  };
}

module.exports = {
  sendPromptToR1
};
