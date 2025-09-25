const helmet = require('helmet');
const cors = require('cors');

class SecurityMiddleware {
  // Configuration Helmet pour la sécurité
  static helmetConfig() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
          scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false
    });
  }

  // Configuration CORS
  static corsConfig() {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:4200',
      'http://localhost',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:4200',
      'http://127.0.0.1'
    ];

    // Ajouter les origines de production si définies
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }

    return cors({
      origin: function (origin, callback) {
        // Permettre les requêtes sans origine (ex: applications mobiles, Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Non autorisé par CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit']
    });
  }

  // Middleware pour ajouter des headers de sécurité personnalisés
  static customSecurityHeaders(req, res, next) {
    // Désactiver la mise en cache pour les réponses sensibles
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    // Ajouter un header pour identifier l'API
    res.setHeader('X-API-Version', '1.0.0');
    res.setHeader('X-Powered-By', 'Todo App API');

    // Ajouter un timestamp de réponse
    res.setHeader('X-Response-Time', new Date().toISOString());

    next();
  }

  // Middleware pour valider les types de contenu
  static validateContentType(req, res, next) {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const contentType = req.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        return res.status(415).json({
          success: false,
          message: 'Content-Type doit être application/json'
        });
      }
    }
    next();
  }

  // Middleware pour limiter la taille des requêtes
  static requestSizeLimiter(maxSize = '10mb') {
    return (req, res, next) => {
      const contentLength = parseInt(req.get('Content-Length') || '0');
      const maxSizeBytes = this.parseSize(maxSize);
      
      if (contentLength > maxSizeBytes) {
        return res.status(413).json({
          success: false,
          message: `Taille de requête trop importante. Maximum autorisé: ${maxSize}`
        });
      }
      next();
    };
  }

  // Helper pour parser la taille
  static parseSize(size) {
    const units = {
      'b': 1,
      'kb': 1024,
      'mb': 1024 * 1024,
      'gb': 1024 * 1024 * 1024
    };
    
    const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2] || 'b';
    
    return value * (units[unit] || 1);
  }
}

module.exports = SecurityMiddleware;
