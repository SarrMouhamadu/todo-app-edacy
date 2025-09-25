const { body, param, query } = require('express-validator');

class ValidationMiddleware {
  // Validation pour la création d'un todo
  static validateCreateTodo() {
    return [
      body('title')
        .trim()
        .notEmpty()
        .withMessage('Le titre est requis')
        .isLength({ min: 3, max: 100 })
        .withMessage('Le titre doit contenir entre 3 et 100 caractères'),
      
      body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La description ne peut pas dépasser 500 caractères'),
      
      body('completed')
        .optional()
        .isBoolean()
        .withMessage('Le statut doit être un booléen'),
      
      body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('La priorité doit être low, medium ou high'),
      
      body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('La date d\'échéance doit être au format ISO 8601')
    ];
  }

  // Validation pour la mise à jour d'un todo
  static validateUpdateTodo() {
    return [
      param('id')
        .isMongoId()
        .withMessage('ID de todo invalide'),
      
      body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Le titre doit contenir entre 3 et 100 caractères'),
      
      body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La description ne peut pas dépasser 500 caractères'),
      
      body('completed')
        .optional()
        .isBoolean()
        .withMessage('Le statut doit être un booléen'),
      
      body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('La priorité doit être low, medium ou high'),
      
      body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('La date d\'échéance doit être au format ISO 8601')
    ];
  }

  // Validation pour les paramètres de requête
  static validateQueryParams() {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La page doit être un entier positif'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('La limite doit être entre 1 et 100'),
      
      query('status')
        .optional()
        .isIn(['all', 'completed', 'pending'])
        .withMessage('Le statut doit être all, completed ou pending'),
      
      query('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('La priorité doit être low, medium ou high'),
      
      query('search')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La recherche ne peut pas dépasser 100 caractères')
    ];
  }

  // Validation pour l'ID MongoDB
  static validateMongoId() {
    return [
      param('id')
        .isMongoId()
        .withMessage('ID invalide')
    ];
  }

  // Validation pour le toggle du statut
  static validateToggleStatus() {
    return [
      param('id')
        .isMongoId()
        .withMessage('ID de todo invalide'),
      
      body('completed')
        .isBoolean()
        .withMessage('Le statut doit être un booléen')
    ];
  }
}

module.exports = ValidationMiddleware;
