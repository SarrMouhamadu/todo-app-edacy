const rateLimit = require('express-rate-limit');

class RateLimiterMiddleware {
  // Limiteur de taux général
  static generalLimiter() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limite chaque IP à 100 requêtes par windowMs
      message: {
        success: false,
        message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        res.status(429).json({
          success: false,
          message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
          retryAfter: '15 minutes'
        });
      }
    });
  }

  // Limiteur de taux strict pour les opérations de création
  static createLimiter() {
    return rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 10, // Limite chaque IP à 10 créations par 5 minutes
      message: {
        success: false,
        message: 'Trop de tentatives de création, veuillez réessayer plus tard.',
        retryAfter: '5 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false
    });
  }

  // Limiteur de taux pour les opérations de suppression
  static deleteLimiter() {
    return rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 20, // Limite chaque IP à 20 suppressions par 10 minutes
      message: {
        success: false,
        message: 'Trop de tentatives de suppression, veuillez réessayer plus tard.',
        retryAfter: '10 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false
    });
  }

  // Limiteur de taux pour les requêtes de recherche
  static searchLimiter() {
    return rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 30, // Limite chaque IP à 30 recherches par minute
      message: {
        success: false,
        message: 'Trop de recherches, veuillez réessayer plus tard.',
        retryAfter: '1 minute'
      },
      standardHeaders: true,
      legacyHeaders: false
    });
  }
}

module.exports = RateLimiterMiddleware;
