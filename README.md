# BotR1 Node.js - Práctica de dependencias y seguridad

Proyecto en Node.js/Express que expone una API para enviar prompts a OpenAI. La práctica está pensada para demostrar gestión de dependencias con `npm`, detección de vulnerabilidades con `npm audit`, corrección de hallazgos y pruebas funcionales con Postman.

## ¿De qué trata este proyecto?

Este proyecto es una práctica en Node.js que permite enviar preguntas a un modelo de IA a través de una API sencilla. Su propósito principal no es solo consumir el servicio, sino mostrar un flujo completo de desarrollo y seguridad: instalar dependencias, revisar vulnerabilidades con `npm audit`, corregirlas y comprobar el funcionamiento de la API con Postman.

En otras palabras, sirve como ejemplo para aprender cómo se organiza una aplicación Node.js pequeña, cómo se manejan sus paquetes y cómo se documenta el proceso de verificación y corrección de errores de seguridad.

## Objetivo de la práctica

- Crear un servicio REST sencillo en Node.js.
- Instalar y administrar dependencias con `npm`.
- Ejecutar `npm audit` para identificar vulnerabilidades.
- Corregir dependencias inseguras y volver a auditar.
- Probar la API con Postman.

## Requisitos

- Node.js 18 o superior.
- npm.
- Cuenta y clave de OpenAI.
- Postman para las pruebas manuales.

## Instalación

1. Clona o abre el proyecto.
2. Instala dependencias:

```bash
npm install
```

3. Crea tu archivo `.env` a partir de `.env.example`:

```bash
copy .env.example .env
```

4. Coloca tu clave de OpenAI en `OPENAI_API_KEY`.

## Variables de entorno

- `OPENAI_API_KEY`: clave de acceso a OpenAI.
- `OPENAI_ORG_ID`: identificador opcional de tu organización de OpenAI.
- `PORT`: puerto del servidor, por defecto `3000`.
- `MODEL`: modelo que consumirá la API, por defecto `gpt-4o-mini`.

## Ejecución

```bash
npm start
```

El servidor expone:

- `GET /health`
- `POST /chat`

## Uso de la API

### GET /health

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "BotR1 Node Practice"
}
```

### POST /chat

Cuerpo de ejemplo:

```json
{
  "systemPrompt": "Responde con claridad y en español.",
  "prompt": "Explícame qué es npm audit en una frase."
}
```

Respuesta esperada:

```json
{
  "model": "gpt-4o-mini",
  "reply": "...",
  "raw": {}
}
```

## Pruebas con Postman

1. Crea una petición `GET` a `http://localhost:3000/health`.
2. Crea una petición `POST` a `http://localhost:3000/chat`.
3. En `Body`, selecciona `raw` y `JSON`.
4. Envía un JSON como el del ejemplo anterior.
5. Verifica el código de respuesta y la respuesta del modelo.

## Gestión de dependencias

Dependencias principales:

- `express`: servidor HTTP.
- `axios`: consumo de la API de OpenAI.
- `dotenv`: carga de variables de entorno.
- `lodash`: utilidades de texto usadas en la normalización del prompt.

Scripts disponibles:

```bash
npm start
npm run dev
npm run audit
npm run audit:fix
```

## Flujo para evidenciar seguridad

1. Instala dependencias.
2. Ejecuta `npm audit`.
3. Documenta los hallazgos detectados.
4. Corrige la dependencia vulnerable.
5. Ejecuta `npm audit` de nuevo hasta obtener el resultado esperado.
6. Prueba el endpoint con Postman y guarda capturas o exportaciones.

## Estructura

- `src/server.js`: servidor Express y rutas.
- `src/r1Service.js`: integración con OpenAI.
- `src/utils.js`: utilidades de normalización.
- `postman/BotR1-Practice.postman_collection.json`: colección de pruebas.
- `docs/evidence.md`: guía para registrar la evidencia del proceso.

## Nota sobre la práctica

El proyecto se dejó preparado para que puedas mostrar el ciclo completo de seguridad: instalación, auditoría, corrección y verificación funcional.
