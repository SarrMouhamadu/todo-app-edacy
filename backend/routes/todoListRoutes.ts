import express from 'express';
import todoListController from '../controllers/todoListController';
import TODOValidationMiddleware from '../middleware/todoValidation';
import RateLimiterMiddleware from '../middleware/rateLimiter';
import ErrorHandler from '../middleware/errorHandler';

const router = express.Router();

// Appliquer le rate limiting général
router.use(RateLimiterMiddleware.generalLimiter());

// Routes pour les TODOLists
router.route('/')
  .get(
    TODOValidationMiddleware.validateTODOListQueryParams(),
    ErrorHandler.asyncHandler(todoListController.getAllTODOLists)
  )
  .post(
    RateLimiterMiddleware.createLimiter(),
    TODOValidationMiddleware.validateCreateTODOList(),
    ErrorHandler.asyncHandler(todoListController.createTODOList)
  );

// Route pour les statistiques
router.get('/stats', 
  ErrorHandler.asyncHandler(todoListController.getTODOListStats)
);

// Route pour les TODOLists récentes (BONUS)
router.get('/recent',
  TODOValidationMiddleware.validateRecentTODOListsParams(),
  ErrorHandler.asyncHandler(todoListController.getRecentTODOLists)
);

// Routes pour une TODOList spécifique
router.route('/:id')
  .get(
    TODOValidationMiddleware.validateMongoId(),
    ErrorHandler.asyncHandler(todoListController.getTODOListById)
  )
  .put(
    TODOValidationMiddleware.validateUpdateTODOList(),
    ErrorHandler.asyncHandler(todoListController.updateTODOList)
  )
  .delete(
    RateLimiterMiddleware.deleteLimiter(),
    TODOValidationMiddleware.validateMongoId(),
    ErrorHandler.asyncHandler(todoListController.deleteTODOList)
  );

// Route pour changer le statut d'une TODOList
router.patch('/:id/status',
  RateLimiterMiddleware.createLimiter(),
  TODOValidationMiddleware.validateTODOListStatus(),
  ErrorHandler.asyncHandler(todoListController.updateTODOListStatus)
);

// Route pour récupérer une TODOList par nom (BONUS)
router.get('/name/:titre',
  TODOValidationMiddleware.validateTODOListName(),
  ErrorHandler.asyncHandler(todoListController.getTODOListByName)
);

export default router;
