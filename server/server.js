const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Ollama } = require('ollama');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434' });

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

app.use(cors());
app.use(express.json());

let history = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server running' });
});

app.get('/api/models', async (req, res) => {
  try {
    let allModels = [];

    // Get Ollama models
    try {
      const ollamaModels = await ollama.list();
      const formattedOllama = ollamaModels.models.map(model => ({
        id: model.name,
        name: model.name,
        provider: 'ollama',
        size: model.size ? `${Math.round(model.size / 1024 / 1024 / 1024 * 10) / 10}GB` : null,
        type: 'local'
      }));
      allModels = [...allModels, ...formattedOllama];
    } catch (ollamaError) {
      console.log('Ollama not available:', ollamaError.message);
    }

    // Get OpenRouter models if API key is provided
    if (OPENROUTER_API_KEY) {
      try {
        const openrouterResponse = await axios.get(`${OPENROUTER_BASE_URL}/models`, {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        const formattedOpenRouter = openrouterResponse.data.data
          .filter(model => !model.id.includes('moderated') && !model.id.includes('free'))
          .slice(0, 20) // Limit to first 20 models to avoid overwhelming UI
          .map(model => ({
            id: model.id,
            name: model.name || model.id,
            provider: 'openrouter',
            pricing: model.pricing ? `$${model.pricing.prompt}/1K tokens` : null,
            type: 'cloud'
          }));
        allModels = [...allModels, ...formattedOpenRouter];
      } catch (openrouterError) {
        console.log('OpenRouter not available:', openrouterError.message);
      }
    }

    res.json({ models: allModels });
  } catch (error) {
    console.error('Models error:', error);
    res.status(500).json({ error: 'Could not load models', models: [] });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, model, provider } = req.body;
  
  if (!message) return res.status(400).json({ error: 'Message required' });
  if (!model) return res.status(400).json({ error: 'Model required' });

  const userMsg = {
    id: Date.now(),
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  };
  history.push(userMsg);

  try {
    const context = history.slice(-10).map(msg => ({ role: msg.role, content: msg.content }));
    let assistantMsg;

    if (provider === 'openrouter') {
      // OpenRouter API call
      if (!OPENROUTER_API_KEY) {
        return res.status(400).json({ error: 'OpenRouter API key not configured' });
      }

      const openrouterResponse = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, {
        model: model,
        messages: context,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/S4CH/promptini',
          'X-Title': 'Promptini'
        }
      });

      assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: openrouterResponse.data.choices[0].message.content,
        timestamp: new Date().toISOString(),
        model,
        provider: 'openrouter'
      };
    } else {
      // Ollama API call
      const response = await ollama.chat({ model, messages: context, stream: false });
      
      assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.message.content,
        timestamp: new Date().toISOString(),
        model,
        provider: 'ollama'
      };
    }

    history.push(assistantMsg);

    res.json({
      success: true,
      message: assistantMsg,
      totalTokens: assistantMsg.provider === 'ollama' ? (response?.eval_count || 0) : 0,
      promptTokens: assistantMsg.provider === 'ollama' ? (response?.prompt_eval_count || 0) : 0
    });

  } catch (error) {
    console.error('Chat error:', error);
    if (provider === 'openrouter') {
      res.status(500).json({ 
        error: 'OpenRouter API error',
        details: error.response?.data?.error?.message || error.message 
      });
    } else {
      if (error.message.includes('model')) {
        res.status(400).json({ 
          error: `Model '${model}' not found`,
          suggestion: `Run: ollama pull ${model}`
        });
      } else {
        res.status(500).json({ error: 'Chat failed', details: error.message });
      }
    }
  }
});

app.get('/api/chat/history', (req, res) => {
  res.json({ history });
});

app.delete('/api/chat/history', (req, res) => {
  history = [];
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Promptini server running on port ${PORT}`);
});

module.exports = app;
