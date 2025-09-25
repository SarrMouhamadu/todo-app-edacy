const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const ValidationMiddleware = require('../middleware/validation');
const RateLimiterMiddleware = require('../middleware/rateLimiter');
const ErrorHandler = require('../middleware/errorHandler');

// Appliquer le rate limiting général
router.use(RateLimiterMiddleware.generalLimiter());

// Routes pour les todos
router.route('/')
  .get(
    ValidationMiddleware.validateQueryParams(),
    ErrorHandler.asyncHandler(todoController.getAllTodos)
  )
  .post(
    RateLimiterMiddleware.createLimiter(),
    ValidationMiddleware.validateCreateTodo(),
    ErrorHandler.asyncHandler(todoController.createTodo)
  );

// Route pour les statistiques
router.get('/stats', 
  ErrorHandler.asyncHandler(todoController.getTodoStats)
);

// Routes pour un todo spécifique
router.route('/:id')
  .get(
    ValidationMiddleware.validateMongoId(),
    ErrorHandler.asyncHandler(todoController.getTodoById)
  )
  .put(
    ValidationMiddleware.validateUpdateTodo(),
    ErrorHandler.asyncHandler(todoController.updateTodo)
  )
  .delete(
    RateLimiterMiddleware.deleteLimiter(),
    ValidationMiddleware.validateMongoId(),
    ErrorHandler.asyncHandler(todoController.deleteTodo)
  );

// Route pour toggle le statut
router.patch('/:id/toggle',
  RateLimiterMiddleware.createLimiter(),
  ValidationMiddleware.validateToggleStatus(),
  ErrorHandler.asyncHandler(todoController.toggleTodoStatus)
);

module.exports = router;
