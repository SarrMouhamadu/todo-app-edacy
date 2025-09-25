const Todo = require('../models/Todo');
const logger = require('../utils/logger');

class TodoService {
  // Récupérer tous les todos avec pagination et filtres
  async getAllTodos({ page = 1, limit = 10, status, search, priority, sortBy = 'createdAt', sortOrder = 'desc' }) {
    try {
      const query = {};
      
      // Filtre par statut
      if (status && status !== 'all') {
        query.completed = status === 'completed';
      }
      
      // Filtre par priorité
      if (priority) {
        query.priority = priority;
      }
      
      // Filtre par recherche
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Configuration de la pagination
      const skip = (page - 1) * limit;
      
      // Configuration du tri
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      // Exécution de la requête
      const todos = await Todo.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();
      
      // Compter le total pour la pagination
      const total = await Todo.countDocuments(query);
      
      logger.info('Todos récupérés', { count: todos.length, total, page, limit });
      
      return {
        todos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération des todos', error);
      throw error;
    }
  }

  // Récupérer un todo par ID
  async getTodoById(id) {
    try {
      const todo = await Todo.findById(id).lean();
      
      if (todo) {
        logger.info('Todo récupéré', { id, title: todo.title });
      } else {
        logger.warn('Todo non trouvé', { id });
      }
      
      return todo;
    } catch (error) {
      logger.error('Erreur lors de la récupération du todo', { id, error: error.message });
      throw error;
    }
  }

  // Créer un nouveau todo
  async createTodo(todoData) {
    try {
      const todo = new Todo({
        ...todoData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const savedTodo = await todo.save();
      
      logger.info('Todo créé', { 
        id: savedTodo._id, 
        title: savedTodo.title,
        completed: savedTodo.completed 
      });
      
      return savedTodo;
    } catch (error) {
      logger.error('Erreur lors de la création du todo', { error: error.message });
      throw error;
    }
  }

  // Mettre à jour un todo
  async updateTodo(id, updateData) {
    try {
      const todo = await Todo.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (todo) {
        logger.info('Todo mis à jour', { 
          id, 
          title: todo.title,
          updatedFields: Object.keys(updateData)
        });
      } else {
        logger.warn('Todo non trouvé pour mise à jour', { id });
      }
      
      return todo;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du todo', { id, error: error.message });
      throw error;
    }
  }

  // Supprimer un todo
  async deleteTodo(id) {
    try {
      const todo = await Todo.findByIdAndDelete(id);
      
      if (todo) {
        logger.info('Todo supprimé', { id, title: todo.title });
      } else {
        logger.warn('Todo non trouvé pour suppression', { id });
      }
      
      return todo;
    } catch (error) {
      logger.error('Erreur lors de la suppression du todo', { id, error: error.message });
      throw error;
    }
  }

  // Toggle le statut d'un todo
  async toggleTodoStatus(id, completed) {
    try {
      const todo = await Todo.findByIdAndUpdate(
        id,
        { completed, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (todo) {
        logger.info('Statut du todo modifié', { 
          id, 
          title: todo.title,
          completed: todo.completed 
        });
      } else {
        logger.warn('Todo non trouvé pour changement de statut', { id });
      }
      
      return todo;
    } catch (error) {
      logger.error('Erreur lors du changement de statut', { id, error: error.message });
      throw error;
    }
  }

  // Récupérer les statistiques des todos
  async getTodoStats() {
    try {
      const stats = await Todo.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
            },
            pending: {
              $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] }
            },
            highPriority: {
              $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
            },
            mediumPriority: {
              $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
            },
            lowPriority: {
              $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
            }
          }
        }
      ]);
      
      const result = stats[0] || {
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0
      };
      
      // Calculer les pourcentages
      result.completionRate = result.total > 0 ? 
        Math.round((result.completed / result.total) * 100) : 0;
      
      logger.info('Statistiques récupérées', result);
      
      return result;
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques', error);
      throw error;
    }
  }

  // Recherche avancée dans les todos
  async searchTodos(searchParams) {
    try {
      const { query, filters = {}, page = 1, limit = 10 } = searchParams;
      
      const mongoQuery = {};
      
      // Recherche textuelle
      if (query) {
        mongoQuery.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }
      
      // Appliquer les filtres
      if (filters.completed !== undefined) {
        mongoQuery.completed = filters.completed;
      }
      
      if (filters.priority) {
        mongoQuery.priority = filters.priority;
      }
      
      if (filters.dateFrom || filters.dateTo) {
        mongoQuery.createdAt = {};
        if (filters.dateFrom) {
          mongoQuery.createdAt.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          mongoQuery.createdAt.$lte = new Date(filters.dateTo);
        }
      }
      
      const skip = (page - 1) * limit;
      
      const todos = await Todo.find(mongoQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();
      
      const total = await Todo.countDocuments(mongoQuery);
      
      logger.info('Recherche effectuée', { 
        query, 
        filters, 
        results: todos.length, 
        total 
      });
      
      return {
        todos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Erreur lors de la recherche', error);
      throw error;
    }
  }
}

module.exports = new TodoService();
