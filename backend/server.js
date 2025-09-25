const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB:'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

// Modèle Todo
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes API

// GET /api/todos - Récupérer tous les todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des todos' });
  }
});

// GET /api/todos/:id - Récupérer un todo par ID
app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo non trouvé' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du todo' });
  }
});

// POST /api/todos - Créer un nouveau todo
app.post('/api/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Le titre est requis' });
    }

    const todo = new Todo({
      title,
      description: description || ''
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du todo' });
  }
});

// PUT /api/todos/:id - Mettre à jour un todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    
    const updateData = {
      updatedAt: new Date()
    };
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ error: 'Todo non trouvé' });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du todo' });
  }
});

// DELETE /api/todos/:id - Supprimer un todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo non trouvé' });
    }

    res.json({ message: 'Todo supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du todo' });
  }
});

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Todo App - Backend fonctionnel!' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
