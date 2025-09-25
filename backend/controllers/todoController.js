const todoService = require('../services/todoService');
const { validationResult } = require('express-validator');

class TodoController {
  // Récupérer tous les todos
  async getAllTodos(req, res) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const todos = await todoService.getAllTodos({ page, limit, status, search });
      
      res.json({
        success: true,
        data: todos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: todos.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des todos',
        error: error.message
      });
    }
  }

  // Récupérer un todo par ID
  async getTodoById(req, res) {
    try {
      const { id } = req.params;
      const todo = await todoService.getTodoById(id);
      
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: 'Todo non trouvé'
        });
      }

      res.json({
        success: true,
        data: todo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du todo',
        error: error.message
      });
    }
  }

  // Créer un nouveau todo
  async createTodo(req, res) {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const todoData = req.body;
      const newTodo = await todoService.createTodo(todoData);
      
      res.status(201).json({
        success: true,
        message: 'Todo créé avec succès',
        data: newTodo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du todo',
        error: error.message
      });
    }
  }

  // Mettre à jour un todo
  async updateTodo(req, res) {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = req.body;
      
      const updatedTodo = await todoService.updateTodo(id, updateData);
      
      if (!updatedTodo) {
        return res.status(404).json({
          success: false,
          message: 'Todo non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Todo mis à jour avec succès',
        data: updatedTodo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du todo',
        error: error.message
      });
    }
  }

  // Supprimer un todo
  async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      const deletedTodo = await todoService.deleteTodo(id);
      
      if (!deletedTodo) {
        return res.status(404).json({
          success: false,
          message: 'Todo non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Todo supprimé avec succès',
        data: deletedTodo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du todo',
        error: error.message
      });
    }
  }

  // Toggle le statut d'un todo
  async toggleTodoStatus(req, res) {
    try {
      const { id } = req.params;
      const { completed } = req.body;
      
      const updatedTodo = await todoService.toggleTodoStatus(id, completed);
      
      if (!updatedTodo) {
        return res.status(404).json({
          success: false,
          message: 'Todo non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Statut du todo mis à jour avec succès',
        data: updatedTodo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du statut',
        error: error.message
      });
    }
  }

  // Récupérer les statistiques des todos
  async getTodoStats(req, res) {
    try {
      const stats = await todoService.getTodoStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }
}

module.exports = new TodoController();
