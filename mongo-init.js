// Script d'initialisation MongoDB
db = db.getSiblingDB('todoapp');

// Créer un utilisateur pour l'application
db.createUser({
  user: 'todoapp',
  pwd: 'todoapp123',
  roles: [
    {
      role: 'readWrite',
      db: 'todoapp'
    }
  ]
});

// Créer une collection de test avec quelques données
db.todos.insertMany([
  {
    title: 'Bienvenue dans votre Todo App !',
    description: 'Cette tâche d\'exemple vous montre comment utiliser l\'application.',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Configurer Docker',
    description: 'Dockeriser l\'application pour un déploiement facile.',
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Tester l\'API',
    description: 'Vérifier que toutes les routes API fonctionnent correctement.',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Base de données todoapp initialisée avec succès !');
