const mongoose = require('mongoose');
const logger = require('../utils/logger');

class DatabaseService {
  constructor() {
    this.isConnected = false;
  }

  // Connexion à MongoDB
  async connect() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';
      
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0
      };

      await mongoose.connect(mongoUri, options);
      
      this.isConnected = true;
      logger.info('Connexion à MongoDB établie', { uri: mongoUri });
      
      // Gestion des événements de connexion
      mongoose.connection.on('error', (error) => {
        logger.error('Erreur de connexion MongoDB', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('Déconnexion de MongoDB');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('Reconnexion à MongoDB');
        this.isConnected = true;
      });

      // Gestion de la fermeture propre
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

    } catch (error) {
      logger.error('Erreur lors de la connexion à MongoDB', error);
      this.isConnected = false;
      throw error;
    }
  }

  // Déconnexion de MongoDB
  async disconnect() {
    try {
      if (this.isConnected) {
        await mongoose.connection.close();
        this.isConnected = false;
        logger.info('Déconnexion de MongoDB effectuée');
      }
    } catch (error) {
      logger.error('Erreur lors de la déconnexion de MongoDB', error);
      throw error;
    }
  }

  // Vérifier l'état de la connexion
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }

  // Obtenir les statistiques de la base de données
  async getDatabaseStats() {
    try {
      if (!this.isConnected) {
        throw new Error('Base de données non connectée');
      }

      const stats = await mongoose.connection.db.stats();
      
      return {
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
        objects: stats.objects,
        avgObjSize: stats.avgObjSize
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques de la base', error);
      throw error;
    }
  }

  // Nettoyer les collections (pour les tests)
  async cleanDatabase() {
    try {
      if (process.env.NODE_ENV !== 'test') {
        throw new Error('Nettoyage de base autorisé uniquement en mode test');
      }

      const collections = await mongoose.connection.db.listCollections().toArray();
      
      for (const collection of collections) {
        await mongoose.connection.db.collection(collection.name).deleteMany({});
      }
      
      logger.info('Base de données nettoyée');
    } catch (error) {
      logger.error('Erreur lors du nettoyage de la base', error);
      throw error;
    }
  }

  // Créer des index pour optimiser les performances
  async createIndexes() {
    try {
      const Todo = require('../models/Todo');
      
      // Index pour la recherche textuelle
      await Todo.collection.createIndex({ 
        title: 'text', 
        description: 'text' 
      });
      
      // Index pour les requêtes fréquentes
      await Todo.collection.createIndex({ completed: 1 });
      await Todo.collection.createIndex({ priority: 1 });
      await Todo.collection.createIndex({ createdAt: -1 });
      await Todo.collection.createIndex({ updatedAt: -1 });
      
      // Index composé pour les requêtes complexes
      await Todo.collection.createIndex({ 
        completed: 1, 
        priority: 1, 
        createdAt: -1 
      });
      
      logger.info('Index créés avec succès');
    } catch (error) {
      logger.error('Erreur lors de la création des index', error);
      throw error;
    }
  }
}

module.exports = new DatabaseService();
