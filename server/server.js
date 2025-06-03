const express = require('express');
const cors = require('cors');
const { Ollama } = require('ollama');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434' });

app.use(cors());
app.use(express.json());

let history = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server running' });
});

app.get('/api/models', async (req, res) => {
  try {
    const models = await ollama.list();
    const formatted = models.models.map(model => ({
      name: model.name,
      size: model.size ? `${Math.round(model.size / 1024 / 1024 / 1024 * 10) / 10}GB` : null,
      modified_at: model.modified_at,
      family: model.details?.family || 'Unknown'
    }));
    res.json({ models: formatted });
  } catch (error) {
    console.error('Models error:', error);
    res.status(500).json({ error: 'Could not load models', models: [] });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, model } = req.body;
  
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
    const response = await ollama.chat({ model, messages: context, stream: false });

    const assistantMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: response.message.content,
      timestamp: new Date().toISOString(),
      model
    };

    history.push(assistantMsg);

    res.json({
      success: true,
      message: assistantMsg,
      totalTokens: response.eval_count || 0,
      promptTokens: response.prompt_eval_count || 0
    });

  } catch (error) {
    console.error('Chat error:', error);
    if (error.message.includes('model')) {
      res.status(400).json({ 
        error: `Model '${model}' not found`,
        suggestion: `Run: ollama pull ${model}`
      });
    } else {
      res.status(500).json({ error: 'Chat failed', details: error.message });
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
