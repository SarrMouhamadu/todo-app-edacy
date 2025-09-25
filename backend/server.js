const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// Import des services et middlewares
const databaseService = require('./services/databaseService');
const logger = require('./utils/logger');
const ErrorHandler = require('./middleware/errorHandler');
const SecurityMiddleware = require('./middleware/security');
const RateLimiterMiddleware = require('./middleware/rateLimiter');

// Import des routes
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de compression
app.use(compression());

// Middleware de logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Middleware de sécurité
app.use(SecurityMiddleware.helmetConfig());
app.use(SecurityMiddleware.corsConfig());
app.use(SecurityMiddleware.customSecurityHeaders());
app.use(SecurityMiddleware.validateContentType());
app.use(SecurityMiddleware.requestSizeLimiter());

// Rate limiting global
app.use(RateLimiterMiddleware.generalLimiter());

// Middleware de parsing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de timing des requêtes
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.request(req, res, duration);
  });
  
  next();
});

// Routes
app.use('/api', apiRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Todo App API - Backend fonctionnel!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      todos: '/api/todos',
      health: '/api/health',
      info: '/api/info'
    }
  });
});

// Middleware pour les routes non trouvées
app.use(ErrorHandler.notFound);

// Middleware de gestion d'erreurs global
app.use(ErrorHandler.handleError);

// Fonction de démarrage du serveur
async function startServer() {
  try {
    // Connexion à la base de données
    await databaseService.connect();
    
    // Création des index pour optimiser les performances
    await databaseService.createIndexes();
    
    // Démarrage du serveur
    const server = app.listen(PORT, () => {
      logger.info(`Serveur démarré sur le port ${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        pid: process.pid
      });
    });

    // Gestion de la fermeture propre
    const gracefulShutdown = async (signal) => {
      logger.info(`Signal ${signal} reçu. Fermeture propre du serveur...`);
      
      server.close(async () => {
        logger.info('Serveur HTTP fermé');
        
        try {
          await databaseService.disconnect();
          logger.info('Base de données déconnectée');
          process.exit(0);
        } catch (error) {
          logger.error('Erreur lors de la fermeture', error);
          process.exit(1);
        }
      });
    };

    // Écouter les signaux de fermeture
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Gestion des erreurs non capturées
    process.on('uncaughtException', (error) => {
      logger.error('Exception non capturée', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Promesse rejetée non gérée', { reason, promise });
      process.exit(1);
    });

  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur', error);
    process.exit(1);
  }
}

// Démarrer le serveur
startServer();
