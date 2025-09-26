import express from 'express';
import todoItemController from '../controllers/todoItemController';
import TODOValidationMiddleware from '../middleware/todoValidation';
import RateLimiterMiddleware from '../middleware/rateLimiter';
import ErrorHandler from '../middleware/errorHandler';

const router = express.Router();

// Appliquer le rate limiting général
router.use(RateLimiterMiddleware.generalLimiter());

// Routes pour les TODOItems
router.route('/')
  .get(
    TODOValidationMiddleware.validateTODOItemQueryParams(),
    ErrorHandler.asyncHandler(todoItemController.getAllTODOItems)
  )
  .post(
    RateLimiterMiddleware.createLimiter(),
    TODOValidationMiddleware.validateCreateTODOItem(),
    ErrorHandler.asyncHandler(todoItemController.createTODOItem)
  );

// Route pour les statistiques
router.get('/stats', 
  TODOValidationMiddleware.validateStatsParams(),
  ErrorHandler.asyncHandler(todoItemController.getTODOItemStats)
);

// Routes pour un TODOItem spécifique
router.route('/:id')
  .get(
    TODOValidationMiddleware.validateMongoId(),
    ErrorHandler.asyncHandler(todoItemController.getTODOItemById)
  )
  .put(
    TODOValidationMiddleware.validateUpdateTODOItem(),
    ErrorHandler.asyncHandler(todoItemController.updateTODOItem)
  )
  .delete(
    RateLimiterMiddleware.deleteLimiter(),
    TODOValidationMiddleware.validateMongoId(),
    ErrorHandler.asyncHandler(todoItemController.deleteTODOItem)
  );

// Route pour toggle le statut d'un TODOItem
router.patch('/:id/toggle',
  RateLimiterMiddleware.createLimiter(),
  TODOValidationMiddleware.validateTODOItemToggle(),
  ErrorHandler.asyncHandler(todoItemController.toggleTODOItemStatus)
);

// Route pour récupérer les TODOItems d'une TODOList
router.get('/list/:todoListId',
  TODOValidationMiddleware.validateMongoId(),
  ErrorHandler.asyncHandler(todoItemController.getTODOItemsByListId)
);

export default router;
