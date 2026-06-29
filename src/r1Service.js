const axios = require('axios');

async function sendPromptToR1({ systemPrompt, userPrompt }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    const error = new Error('Falta la variable OPENAI_API_KEY en el archivo .env.');
    error.statusCode = 500;
    throw error;
  }

  const messages = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  messages.push({ role: 'user', content: userPrompt });

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model,
      messages,
      temperature: 0.7
    },
    {
      ...(process.env.OPENAI_ORG_ID ? { 'OpenAI-Organization': process.env.OPENAI_ORG_ID } : {}),
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
