# Evidencia de la práctica

## Estructura que debes crear

Si te piden recrear el proyecto desde cero, estos son los archivos mínimos que debes tener:

- `package.json`
- `.env.example`
- `src/server.js`
- `src/r1Service.js`
- `src/utils.js`
- `postman/BotR1-Practice.postman_collection.json`
- `README.md`

## Código base de cada archivo

### package.json

```json
{
	"name": "botr1-node-practice",
	"version": "1.0.0",
	"description": "Práctica en Node.js para consultar DeepSeek, gestionar dependencias y revisar vulnerabilidades con npm audit.",
	"main": "src/server.js",
	"type": "commonjs",
	"scripts": {
		"start": "node src/server.js",
		"dev": "node --watch src/server.js",
		"audit": "npm audit",
		"audit:fix": "npm audit fix"
	},
	"dependencies": {
		"axios": "^1.11.0",
		"dotenv": "^16.6.1",
		"express": "^4.21.2",
		"lodash": "^4.17.21"
	}
}
```

### .env.example

```bash
DEEPSEEK_API_KEY=tu_clave_aqui
PORT=3000
MODEL=deepseek-chat
```

### src/server.js

```js
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
			return res.status(400).json({ error: 'El campo prompt es obligatorio.' });
		}

		const result = await sendPromptToR1({ systemPrompt, userPrompt });
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
```

### src/r1Service.js

```js
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
```

### src/utils.js

```js
const _ = require('lodash');

function normalizePrompt(value) {
	if (typeof value !== 'string') {
		return '';
	}

	return _.trim(value);
}

module.exports = {
	normalizePrompt
};
```

### postman/BotR1-Practice.postman_collection.json

```json
{
	"info": {
		"name": "BotR1 Node Practice",
		"_postman_id": "b9b0d49e-7d2c-4f8e-a5d6-0a6c8f5e1f11",
		"description": "Colección para probar la API BotR1 en Node.js.",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "Health",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "{{baseUrl}}/health",
					"host": ["{{baseUrl}}"],
					"path": ["health"]
				}
			}
		},
		{
			"name": "Chat",
			"request": {
				"method": "POST",
				"header": [{ "key": "Content-Type", "value": "application/json" }],
				"body": {
					"mode": "raw",
					"raw": "{\n  \"systemPrompt\": \"Responde de forma breve y clara.\",\n  \"prompt\": \"Explica en una frase qué hace npm audit.\"\n}"
				},
				"url": {
					"raw": "{{baseUrl}}/chat",
					"host": ["{{baseUrl}}"],
					"path": ["chat"]
				}
			}
		}
	],
	"variable": [{ "key": "baseUrl", "value": "http://localhost:3000" }]
}
```

## Pasos para reconstruir y evidenciar

## 1. Instalación de dependencias

```bash
npm install
```

## 2. Auditoría inicial

```bash
npm audit
```

Registra aquí los hallazgos que aparezcan en tu entorno y adjunta captura o copia del resultado.
Si no tomaste captura del error, pega directamente la salida de terminal en tu informe; para esta práctica basta con evidenciar el hallazgo y la corrección.

Si necesitas volver a provocar el error para documentarlo, cambia temporalmente `lodash` en `package.json` a `4.17.20`, ejecuta `npm install` y luego corre otra vez `npm audit`.

## 3. Corrección

```bash
npm audit fix
```

Si alguna vulnerabilidad no se corrige automáticamente, actualiza la dependencia de forma manual en `package.json` y vuelve a instalar.

## 4. Verificación final

```bash
npm audit
```

El resultado esperado es que no queden vulnerabilidades críticas o que se documente claramente el riesgo residual si no existe corrección disponible.

## 5. Pruebas en Postman

- `GET http://localhost:3000/health`
- `POST http://localhost:3000/chat`

Guarda capturas de la colección y de las respuestas.

## 6. Entregables sugeridos

- Captura del `npm audit` inicial.
- Captura o texto del `npm audit` final.
- Exportación de la colección de Postman.
- Capturas de las respuestas de los endpoints.
