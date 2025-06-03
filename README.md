# Promptini - Universal LLM Chat Interface

A modern, elegant universal chat application built with React and Node.js, designed to work with any LLM model available through Ollama.

![Promptini](https://img.shields.io/badge/AI-Promptini-blue) ![React](https://img.shields.io/badge/React-18.x-61dafb) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![Ollama](https://img.shields.io/badge/Ollama-Universal-purple)

## ✨ Features

- 🤖 **Universal LLM Support**: Chat with any LLM model available through Ollama
- 🔄 **Dynamic Model Loading**: Automatically detects and loads available models
- 💬 **Real-time Messaging**: Instant responses with elegant typing indicators
- 📱 **Responsive Design**: Beautiful, modern UI that works on desktop and mobile
- 🎨 **Elegant Interface**: Clean, sophisticated design with smooth animations and gradients
- 📝 **Markdown Support**: Properly formatted AI responses with code highlighting
- 💾 **Chat History**: Persistent conversation history during session
- 🔧 **Model Selection**: Easy switching between different Ollama models
- ⚡ **Fast Performance**: Optimized React frontend with efficient API calls

## 🚀 Quick Start

### Prerequisites

1. **Install Ollama**: Download and install from [ollama.ai](https://ollama.ai)
2. **Pull DeepSeek Model**: 
   ```bash
   ollama pull deepseek-r1:1.5b
   ```
3. **Node.js**: Version 14 or higher

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd chatgpt-clone
   npm run install-all
   ```

2. **Start the application**:
   ```bash
   npm run dev
   ```

This will start both the frontend (http://localhost:3000) and backend (http://localhost:3001) concurrently.

## 📁 Project Structure

```
chatgpt-clone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── Chat.js        # Main chat component
│   │   ├── Chat.css       # Chat styling
│   │   ├── App.js         # Root component
│   │   └── App.css        # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── server.js          # Express server with Ollama integration
│   ├── .env               # Environment variables
│   └── package.json
├── .github/
│   └── copilot-instructions.md
├── package.json           # Root package with scripts
└── README.md
```

## 🛠️ Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the React frontend
- `npm run server` - Start only the Node.js backend
- `npm run install-all` - Install dependencies for all packages
- `npm run build` - Build the React app for production

## 🔧 Configuration

### Environment Variables (server/.env)

```env
PORT=3001
OLLAMA_HOST=http://127.0.0.1:11434
DEFAULT_MODEL=deepseek-r1:1.5b
```

### Ollama Setup

1. **Install Ollama**:
   - Windows: Download from [ollama.ai](https://ollama.ai)
   - macOS: `brew install ollama`
   - Linux: `curl -fsSL https://ollama.ai/install.sh | sh`

2. **Start Ollama service**:
   ```bash
   ollama serve
   ```

3. **Pull DeepSeek model**:
   ```bash
   ollama pull deepseek-r1:1.5b
   ```

4. **Verify installation**:
   ```bash
   ollama list
   ```

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/models` | List available Ollama models |
| POST | `/api/chat` | Send message and get AI response |
| GET | `/api/chat/history` | Get conversation history |
| DELETE | `/api/chat/history` | Clear conversation history |

### Example API Usage

```javascript
// Send a chat message
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello, how are you?',
    model: 'deepseek-r1:1.5b'
  })
});
```

## 🎨 UI Components

- **Chat Interface**: Modern chat bubbles with user/assistant distinction
- **Typing Indicator**: Animated dots showing AI is thinking
- **Model Selector**: Dropdown to switch between available models
- **Message History**: Scrollable conversation history
- **Responsive Design**: Mobile-first design that adapts to all screen sizes

## 🔍 Troubleshooting

### Common Issues

1. **"Could not connect to Ollama"**
   - Ensure Ollama is running: `ollama serve`
   - Check if the service is on port 11434: `netstat -an | findstr 11434`

2. **"Model not found"**
   - Pull the model: `ollama pull deepseek-r1:1.5b`
   - List models: `ollama list`

3. **Frontend not connecting to backend**
   - Check if backend is running on port 3001
   - Verify CORS is enabled in server.js

4. **Port already in use**
   - Change PORT in server/.env
   - Or kill the process using the port

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure Ollama is installed and models are pulled
3. Deploy the server/ directory

### Frontend Deployment
1. Build the React app: `cd client && npm run build`
2. Deploy the build/ directory to your static hosting service
3. Update API endpoints to point to your deployed backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) for the local AI model runtime
- [DeepSeek](https://deepseek.com) for the powerful language model
- [React](https://reactjs.org) for the frontend framework
- [Express](https://expressjs.com) for the backend framework

---

⭐ If you found this project helpful, please give it a star on GitHub!
