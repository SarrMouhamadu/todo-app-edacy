const logger = require('../utils/logger');

class ErrorHandler {
  // Middleware de gestion d'erreurs global
  static handleError(err, req, res, next) {
    let error = { ...err };
    error.message = err.message;

    // Log de l'erreur
    logger.error('Error Handler:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Erreur de validation Mongoose
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      error = {
        message,
        statusCode: 400
      };
    }

    // Erreur de cast Mongoose (ID invalide)
    if (err.name === 'CastError') {
      const message = 'Ressource non trouvée';
      error = {
        message,
        statusCode: 404
      };
    }

    // Erreur de duplication MongoDB
    if (err.code === 11000) {
      const message = 'Ressource déjà existante';
      error = {
        message,
        statusCode: 400
      };
    }

    // Erreur JWT
    if (err.name === 'JsonWebTokenError') {
      const message = 'Token invalide';
      error = {
        message,
        statusCode: 401
      };
    }

    // Erreur JWT expiré
    if (err.name === 'TokenExpiredError') {
      const message = 'Token expiré';
      error = {
        message,
        statusCode: 401
      };
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Erreur serveur interne',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Middleware pour les routes non trouvées
  static notFound(req, res, next) {
    const error = new Error(`Route non trouvée - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
  }

  // Wrapper pour les fonctions async
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = ErrorHandler;
