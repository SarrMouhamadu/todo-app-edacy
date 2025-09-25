const os = require('os');
const process = require('process');

class HealthController {
  // Vérification de santé de l'API
  async healthCheck(req, res) {
    try {
      const healthData = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024)
        },
        system: {
          platform: os.platform(),
          arch: os.arch(),
          cpus: os.cpus().length,
          loadAverage: os.loadavg()
        }
      };

      res.json({
        success: true,
        data: healthData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de santé',
        error: error.message
      });
    }
  }

  // Informations sur l'API
  async apiInfo(req, res) {
    try {
      const apiInfo = {
        name: 'Todo App API',
        version: '1.0.0',
        description: 'API REST pour la gestion de tâches',
        endpoints: {
          todos: {
            GET: '/api/todos - Récupérer tous les todos',
            POST: '/api/todos - Créer un nouveau todo',
            GET: '/api/todos/:id - Récupérer un todo par ID',
            PUT: '/api/todos/:id - Mettre à jour un todo',
            DELETE: '/api/todos/:id - Supprimer un todo'
          },
          health: {
            GET: '/api/health - Vérification de santé',
            GET: '/api/info - Informations sur l\'API'
          }
        },
        documentation: 'Voir le README.md pour plus d\'informations'
      };

      res.json({
        success: true,
        data: apiInfo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des informations',
        error: error.message
      });
    }
  }
}

module.exports = new HealthController();
