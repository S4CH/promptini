import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, Trash2, Bot, User, AlertCircle } from 'lucide-react';
import './Chat.css';

const API_BASE = 'http://localhost:3001/api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [modelsLoading, setModelsLoading] = useState(true);
  const messagesEndRef = useRef(null);  useEffect(() => {
    loadHistory();
    loadModels();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE}/chat/history`);
      setMessages(response.data.history);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };  const loadModels = async () => {
    setModelsLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/models`);
      const available = response.data.models || [];
      setModels(available);
      
      if (available.length > 0 && !selectedModel) {
        setSelectedModel(available[0].name);
      }
      
      if (available.length === 0) {
        setError('No models found. Install one with: ollama pull <model-name>');
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      setError('Could not connect to Ollama. Make sure it\'s running.');
    } finally {
      setModelsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    if (!selectedModel) {
      setError('Please select a model first.');
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/chat`, {
        message: input.trim(),
        model: selectedModel
      });

      if (response.data.success) {
        setMessages(prev => [...prev, response.data.message]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error: ${error.response?.data?.error || 'Failed to get response'}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(error.response?.data?.suggestion || 'Check if Ollama is running.');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete(`${API_BASE}/chat/history`);
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-content">
          <h1><Bot className="header-icon" /> Promptini</h1>
          <span className="subtitle">Universal LLM Chat Interface</span>
        </div>
        <div className="header-controls">
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-selector"
            disabled={modelsLoading || models.length === 0}
          >
            {modelsLoading ? (
              <option value="">Loading models...</option>
            ) : models.length === 0 ? (
              <option value="">No models available</option>
            ) : (
              <>
                {!selectedModel && <option value="">Select a model...</option>}
                {models.map(model => (
                  <option key={model.name} value={model.name}>
                    {model.name}
                    {model.size ? ` (${model.size})` : ''}
                  </option>
                ))}
              </>
            )}
          </select>
          <button onClick={clearHistory} className="clear-btn" title="Clear Chat History">
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          {error}
          {error.includes('No models found') && (
            <div className="error-suggestion">
              <p>Install a model using: <code>ollama pull llama2</code> or <code>ollama pull mistral</code></p>
            </div>
          )}
        </div>
      )}

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <Bot size={48} className="welcome-icon" />
            <h2>Welcome to Promptini</h2>
            <p>Your universal chat interface for any LLM model available through Ollama</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="message-content">
                <div className={`message-bubble ${message.isError ? 'error' : ''}`}>
                  {message.role === 'assistant' && !message.isError ? (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
                <div className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                  {message.model && ` • ${message.model}`}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="message assistant">
            <div className="message-avatar">
              <Bot size={20} />
            </div>
            <div className="message-content">
              <div className="message-bubble loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            rows={1}
            className="message-input"
            disabled={loading}
          />
          <button 
            onClick={sendMessage} 
            disabled={!input.trim() || loading}
            className="send-button"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
