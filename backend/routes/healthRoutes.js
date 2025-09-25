const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const ErrorHandler = require('../middleware/errorHandler');

// Route pour la vérification de santé
router.get('/health', 
  ErrorHandler.asyncHandler(healthController.healthCheck)
);

// Route pour les informations de l'API
router.get('/info', 
  ErrorHandler.asyncHandler(healthController.apiInfo)
);

module.exports = router;
