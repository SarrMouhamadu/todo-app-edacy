import { body, param, query } from 'express-validator';
import { isValidTODOStatus, isValidItemStatus } from '../types/todo';

class TODOValidationMiddleware {
  // Validation pour la création d'une TODOList
  static validateCreateTODOList() {
    return [
      body('titre')
        .trim()
        .notEmpty()
        .withMessage('Le titre est requis')
        .isLength({ min: 3, max: 100 })
        .withMessage('Le titre doit contenir entre 3 et 100 caractères'),
      
      body('status')
        .optional()
        .custom((value) => {
          if (!isValidTODOStatus(value)) {
            throw new Error('Le statut doit être TODO, IN_PROGRESS ou DONE');
          }
          return true;
        })
    ];
  }

  // Validation pour la mise à jour d'une TODOList
  static validateUpdateTODOList() {
    return [
      param('id')
        .isMongoId()
        .withMessage('ID de TODOList invalide'),
      
      body('titre')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Le titre doit contenir entre 3 et 100 caractères'),
      
      body('status')
        .optional()
        .custom((value) => {
          if (!isValidTODOStatus(value)) {
            throw new Error('Le statut doit être TODO, IN_PROGRESS ou DONE');
          }
          return true;
        })
    ];
  }

  // Validation pour la création d'un TODOItem
  static validateCreateTODOItem() {
    return [
      body('libelle')
        .trim()
        .notEmpty()
        .withMessage('Le libellé est requis')
        .isLength({ min: 3, max: 200 })
        .withMessage('Le libellé doit contenir entre 3 et 200 caractères'),
      
      body('status')
        .optional()
        .custom((value) => {
          if (!isValidItemStatus(value)) {
            throw new Error('Le statut doit être DONE ou NOT_DONE');
          }
          return true;
        }),
      
      body('todoListId')
        .isMongoId()
        .withMessage('ID de TODOList invalide')
    ];
  }

  // Validation pour la mise à jour d'un TODOItem
  static validateUpdateTODOItem() {
    return [
      param('id')
        .isMongoId()
        .withMessage('ID de TODOItem invalide'),
      
      body('libelle')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Le libellé doit contenir entre 3 et 200 caractères'),
      
      body('status')
        .optional()
        .custom((value) => {
          if (!isValidItemStatus(value)) {
            throw new Error('Le statut doit être DONE ou NOT_DONE');
          }
          return true;
        })
    ];
  }

  // Validation pour les paramètres de requête TODOList
  static validateTODOListQueryParams() {
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
        .custom((value) => {
          if (!isValidTODOStatus(value)) {
            throw new Error('Le statut doit être TODO, IN_PROGRESS ou DONE');
          }
          return true;
        }),
      
      query('search')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La recherche ne peut pas dépasser 100 caractères'),
      
      query('sortBy')
        .optional()
        .isIn(['titre', 'status', 'createdAt', 'updatedAt'])
        .withMessage('Le tri doit être par titre, status, createdAt ou updatedAt'),
      
      query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('L\'ordre de tri doit être asc ou desc')
    ];
  }

  // Validation pour les paramètres de requête TODOItem
  static validateTODOItemQueryParams() {
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
        .custom((value) => {
          if (!isValidItemStatus(value)) {
            throw new Error('Le statut doit être DONE ou NOT_DONE');
          }
          return true;
        }),
      
      query('search')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La recherche ne peut pas dépasser 100 caractères'),
      
      query('todoListId')
        .optional()
        .isMongoId()
        .withMessage('ID de TODOList invalide')
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

  // Validation pour le nom de TODOList
  static validateTODOListName() {
    return [
      param('titre')
        .trim()
        .notEmpty()
        .withMessage('Le titre est requis')
        .isLength({ min: 3, max: 100 })
        .withMessage('Le titre doit contenir entre 3 et 100 caractères')
    ];
  }

  // Validation pour le changement de statut TODOList
  static validateTODOListStatus() {
    return [
      param('id')
        .isMongoId()
        .withMessage('ID de TODOList invalide'),
      
      body('status')
        .notEmpty()
        .withMessage('Le statut est requis')
        .custom((value) => {
          if (!isValidTODOStatus(value)) {
            throw new Error('Le statut doit être TODO, IN_PROGRESS ou DONE');
          }
          return true;
        })
    ];
  }

  // Validation pour le toggle de statut TODOItem
  static validateTODOItemToggle() {
    return [
      param('id')
        .isMongoId()
        .withMessage('ID de TODOItem invalide')
    ];
  }

  // Validation pour les paramètres de requête des TODOLists récentes
  static validateRecentTODOListsParams() {
    return [
      query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('La limite doit être entre 1 et 50')
    ];
  }

  // Validation pour les statistiques
  static validateStatsParams() {
    return [
      query('todoListId')
        .optional()
        .isMongoId()
        .withMessage('ID de TODOList invalide')
    ];
  }
}

export default TODOValidationMiddleware;
