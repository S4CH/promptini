# Promptini

Universal LLM chat interface powered by Ollama. Clean, fast, and works with any model.

## Features

- Universal support for any Ollama model
- Real-time chat with typing indicators  
- Responsive design with elegant UI
- Markdown rendering for AI responses
- Session-based chat history
- Dynamic model detection and switching

## Quick Start

1. Install [Ollama](https://ollama.ai) and pull a model:
   ```bash
   ollama pull llama2
   # or
   ollama pull deepseek-r1:1.5b
   ```

2. Clone and install:
   ```bash
   git clone https://github.com/S4CH/promptini.git
   cd promptini
   npm install
   ```

3. Start the application:
   ## Development

```bash
npm run dev      # Start both frontend and backend
npm run client   # Frontend only (port 3000)
npm run server   # Backend only (port 3001)
```

## API

- `GET /api/models` - List available models
- `POST /api/chat` - Send message
- `GET /api/chat/history` - Get history
- `DELETE /api/chat/history` - Clear history

## Tech Stack

- **Frontend**: React, axios, react-markdown
- **Backend**: Node.js, Express, Ollama client
- **Styling**: CSS with glassmorphism effects

## License

MIT

---

⭐ If you found this project helpful, please give it a star on GitHub!
