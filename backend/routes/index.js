const express = require('express');
const router = express.Router();

// Import des routes
const todoRoutes = require('./todoRoutes');
const healthRoutes = require('./healthRoutes');

// Route racine
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Todo App API - Backend fonctionnel!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      todos: '/api/todos',
      health: '/api/health',
      info: '/api/info'
    }
  });
});

// Montage des routes
router.use('/todos', todoRoutes);
router.use('/', healthRoutes);

module.exports = router;
