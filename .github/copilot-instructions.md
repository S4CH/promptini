<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Promptini - Universal LLM Chat Interface

This is an elegant, universal LLM chat application that uses:
- **Frontend**: React with modern UI components, elegant gradients, and responsive design
- **Backend**: Node.js/Express server with Ollama integration
- **AI Models**: Any LLM model available through Ollama (DeepSeek, Llama, Mistral, CodeLlama, etc.)

## Project Structure
- `client/` - React frontend application
- `server/` - Node.js backend with Express and Ollama integration
- Root `package.json` - Contains scripts to run both frontend and backend concurrently

## Key Features
- Real-time chat interface with elegant typing indicators
- Dynamic model detection and selection
- Universal support for any Ollama-compatible LLM
- Message history management
- Markdown rendering for AI responses
- Error handling and user feedback
- Responsive design for mobile and desktop
- Elegant gradient backgrounds and glassmorphism effects

## Development Guidelines
- Use modern React patterns with hooks
- Implement proper error handling and loading states
- Follow accessibility best practices
- Use CSS modules or styled-components for styling
- Ensure proper TypeScript types if converting to TypeScript
- Implement proper API error handling
- Use environment variables for configuration

## API Endpoints
- `GET /api/health` - Server health check
- `GET /api/models` - List available Ollama models
- `POST /api/chat` - Send chat message and get AI response
- `GET /api/chat/history` - Get chat message history
- `DELETE /api/chat/history` - Clear chat history

## Required Dependencies
### Frontend
- axios - HTTP client for API requests
- react-markdown - Markdown rendering
- lucide-react - Icon components

### Backend
- express - Web framework
- cors - CORS middleware
- ollama - Ollama client library
- dotenv - Environment variable management
- nodemon - Development server with hot reload
