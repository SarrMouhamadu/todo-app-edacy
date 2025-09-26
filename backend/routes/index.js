const express = require('express');
const router = express.Router();

// Import des routes
const todoListRoutes = require('./todoListRoutes');
const todoItemRoutes = require('./todoItemRoutes');
const healthRoutes = require('./healthRoutes');

// Route racine
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Todo App API - Backend fonctionnel!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      todoLists: '/api/todolists',
      todoItems: '/api/todoitems',
      health: '/api/health',
      info: '/api/info'
    },
    features: {
      todoLists: {
        'GET /api/todolists': 'Récupérer toutes les TODOLists',
        'POST /api/todolists': 'Créer une nouvelle TODOList',
        'GET /api/todolists/:id': 'Récupérer une TODOList par ID',
        'PUT /api/todolists/:id': 'Mettre à jour une TODOList',
        'DELETE /api/todolists/:id': 'Supprimer une TODOList',
        'PATCH /api/todolists/:id/status': 'Changer le statut d\'une TODOList',
        'GET /api/todolists/name/:titre': 'Récupérer une TODOList par nom',
        'GET /api/todolists/recent': 'Récupérer les TODOLists récentes',
        'GET /api/todolists/stats': 'Statistiques des TODOLists'
      },
      todoItems: {
        'GET /api/todoitems': 'Récupérer tous les TODOItems',
        'POST /api/todoitems': 'Créer un nouveau TODOItem',
        'GET /api/todoitems/:id': 'Récupérer un TODOItem par ID',
        'PUT /api/todoitems/:id': 'Mettre à jour un TODOItem',
        'DELETE /api/todoitems/:id': 'Supprimer un TODOItem',
        'PATCH /api/todoitems/:id/toggle': 'Toggle le statut d\'un TODOItem',
        'GET /api/todoitems/list/:todoListId': 'Récupérer les TODOItems d\'une TODOList',
        'GET /api/todoitems/stats': 'Statistiques des TODOItems'
      }
    }
  });
});

// Montage des routes
router.use('/todolists', todoListRoutes);
router.use('/todoitems', todoItemRoutes);
router.use('/', healthRoutes);

module.exports = router;
