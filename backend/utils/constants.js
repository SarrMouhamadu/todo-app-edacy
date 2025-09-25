// Constantes de l'application
const APP_CONSTANTS = {
  // Statuts des todos
  TODO_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    ALL: 'all'
  },

  // Priorités des todos
  TODO_PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  },

  // Messages de réponse
  MESSAGES: {
    SUCCESS: {
      TODO_CREATED: 'Todo créé avec succès',
      TODO_UPDATED: 'Todo mis à jour avec succès',
      TODO_DELETED: 'Todo supprimé avec succès',
      TODO_RETRIEVED: 'Todo récupéré avec succès',
      TODOS_RETRIEVED: 'Todos récupérés avec succès',
      STATUS_TOGGLED: 'Statut du todo mis à jour avec succès',
      STATS_RETRIEVED: 'Statistiques récupérées avec succès'
    },
    ERROR: {
      TODO_NOT_FOUND: 'Todo non trouvé',
      TODOS_NOT_FOUND: 'Aucun todo trouvé',
      INVALID_DATA: 'Données invalides',
      VALIDATION_FAILED: 'Validation échouée',
      SERVER_ERROR: 'Erreur interne du serveur',
      DATABASE_ERROR: 'Erreur de base de données',
      UNAUTHORIZED: 'Non autorisé',
      FORBIDDEN: 'Accès interdit',
      NOT_FOUND: 'Ressource non trouvée',
      CONFLICT: 'Conflit de ressources',
      TOO_MANY_REQUESTS: 'Trop de requêtes',
      SERVICE_UNAVAILABLE: 'Service indisponible'
    }
  },

  // Codes de statut HTTP
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  },

  // Configuration de pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1
  },

  // Configuration de rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    CREATE_WINDOW_MS: 5 * 60 * 1000, // 5 minutes
    MAX_CREATE_REQUESTS: 10,
    DELETE_WINDOW_MS: 10 * 60 * 1000, // 10 minutes
    MAX_DELETE_REQUESTS: 20,
    SEARCH_WINDOW_MS: 1 * 60 * 1000, // 1 minute
    MAX_SEARCH_REQUESTS: 30
  },

  // Configuration de validation
  VALIDATION: {
    TITLE: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 100
    },
    DESCRIPTION: {
      MAX_LENGTH: 500
    },
    SEARCH: {
      MAX_LENGTH: 100
    }
  },

  // Configuration de la base de données
  DATABASE: {
    CONNECTION_TIMEOUT: 5000,
    SOCKET_TIMEOUT: 45000,
    MAX_POOL_SIZE: 10
  },

  // Configuration des logs
  LOGGING: {
    LEVELS: {
      ERROR: 'error',
      WARN: 'warn',
      INFO: 'info',
      DEBUG: 'debug'
    },
    DEFAULT_LEVEL: 'info'
  },

  // Configuration de sécurité
  SECURITY: {
    MAX_REQUEST_SIZE: '10mb',
    ALLOWED_ORIGINS: [
      'http://localhost:3000',
      'http://localhost:4200',
      'http://localhost',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:4200',
      'http://127.0.0.1'
    ]
  },

  // Configuration de l'API
  API: {
    VERSION: '1.0.0',
    NAME: 'Todo App API',
    DESCRIPTION: 'API REST pour la gestion de tâches'
  }
};

// Fonctions utilitaires pour les constantes
const getMessage = (category, key) => {
  return APP_CONSTANTS.MESSAGES[category]?.[key] || 'Message non défini';
};

const getHttpStatus = (key) => {
  return APP_CONSTANTS.HTTP_STATUS[key] || 500;
};

const isValidPriority = (priority) => {
  return Object.values(APP_CONSTANTS.TODO_PRIORITY).includes(priority);
};

const isValidStatus = (status) => {
  return Object.values(APP_CONSTANTS.TODO_STATUS).includes(status);
};

const getDefaultPagination = () => {
  return {
    page: APP_CONSTANTS.PAGINATION.DEFAULT_PAGE,
    limit: APP_CONSTANTS.PAGINATION.DEFAULT_LIMIT
  };
};

module.exports = {
  ...APP_CONSTANTS,
  getMessage,
  getHttpStatus,
  isValidPriority,
  isValidStatus,
  getDefaultPagination
};
