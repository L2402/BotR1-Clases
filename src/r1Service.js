const axios = require('axios');

async function sendPromptToR1({ systemPrompt, userPrompt }) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.MODEL || 'deepseek-reasoner';

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
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model,
      messages,
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000'
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

function mapAxiosError(error) {
  const statusCode = error.response?.status || 500;
  const providerMessage = error.response?.data?.error?.message;
  const message = providerMessage || error.message || 'Error inesperado al procesar la consulta.';
  const mapped = new Error(message);
  mapped.statusCode = statusCode;
  return mapped;
}

async function sendPromptToR1Safe(payload) {
  try {
    return await sendPromptToR1(payload);
  } catch (error) {
    throw mapAxiosError(error);
  }
}

module.exports = {
  sendPromptToR1: sendPromptToR1Safe
};
