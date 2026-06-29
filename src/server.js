const express = require('express');
const dotenv = require('dotenv');
const { normalizePrompt } = require('./utils');
const { sendPromptToR1 } = require('./r1Service');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'BotR1 Node Practice' });
});

app.post('/chat', async (req, res) => {
  try {
    const systemPrompt = normalizePrompt(req.body.systemPrompt);
    const userPrompt = normalizePrompt(req.body.prompt);

    if (!userPrompt) {
      return res.status(400).json({
        error: 'El campo prompt es obligatorio.'
      });
    }

    const result = await sendPromptToR1({
      systemPrompt,
      userPrompt
    });

    return res.json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Error inesperado al procesar la consulta.'
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor BotR1 escuchando en http://localhost:${port}`);
});
