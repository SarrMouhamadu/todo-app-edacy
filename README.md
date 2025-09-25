# 📝 Todo App - Application de Gestion de Tâches

Une application web moderne de gestion de tâches construite avec **Express.js**, **Angular** et **MongoDB**, entièrement dockerisée pour un déploiement facile.

## 🚀 Fonctionnalités

- ✅ **CRUD complet** : Créer, lire, mettre à jour et supprimer des tâches
- 🎨 **Interface moderne** : Design responsive avec Bootstrap et animations CSS
- 🔄 **Temps réel** : Mise à jour instantanée des données
- 🏷️ **Filtrage** : Filtrer les tâches par statut (toutes, terminées, en attente)
- ✏️ **Édition inline** : Modifier les tâches directement dans la liste
- 📱 **Responsive** : Compatible mobile et desktop
- 🐳 **Dockerisé** : Déploiement facile avec Docker Compose

## 🏗️ Architecture

```
Todo App/
├── backend/                 # API Express.js
│   ├── server.js           # Serveur principal
│   ├── package.json        # Dépendances Node.js
│   └── Dockerfile          # Image Docker backend
├── frontend/               # Application Angular
│   ├── src/                # Code source Angular
│   ├── package.json        # Dépendances Angular
│   ├── Dockerfile          # Image Docker frontend
│   └── nginx.conf          # Configuration Nginx
├── docker-compose.yml      # Orchestration des services
├── mongo-init.js          # Script d'initialisation MongoDB
└── README.md              # Documentation
```

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** 18+ - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **CORS** - Gestion des requêtes cross-origin

### Frontend
- **Angular** 16+ - Framework frontend
- **TypeScript** - Langage de programmation
- **Bootstrap** 5 - Framework CSS
- **Font Awesome** - Icônes
- **RxJS** - Programmation réactive

### DevOps
- **Docker** - Containerisation
- **Docker Compose** - Orchestration multi-conteneurs
- **Nginx** - Serveur web et proxy reverse

## 🚀 Installation et Déploiement

### Prérequis
- Docker et Docker Compose installés
- Git (pour cloner le projet)

### Déploiement avec Docker (Recommandé)

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd todo-app
   ```

2. **Démarrer l'application**
   ```bash
   docker-compose up -d
   ```

3. **Accéder à l'application**
   - Frontend : http://localhost
   - Backend API : http://localhost:3000
   - MongoDB : localhost:27017

### Déploiement en développement

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### MongoDB
```bash
# Avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Ou installer MongoDB localement
```

## 📡 API Endpoints

### Base URL: `http://localhost:3000/api`

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/todos` | Récupérer toutes les tâches |
| GET | `/todos/:id` | Récupérer une tâche par ID |
| POST | `/todos` | Créer une nouvelle tâche |
| PUT | `/todos/:id` | Mettre à jour une tâche |
| DELETE | `/todos/:id` | Supprimer une tâche |

### Exemple de requête POST
```json
{
  "title": "Ma nouvelle tâche",
  "description": "Description optionnelle"
}
```

## 🐳 Commandes Docker Utiles

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter tous les services
docker-compose down

# Reconstruire les images
docker-compose build --no-cache

# Accéder au conteneur MongoDB
docker exec -it todo-mongodb mongosh

# Nettoyer les volumes
docker-compose down -v
```

## 🔧 Configuration

### Variables d'environnement

#### Backend
- `PORT` : Port du serveur (défaut: 3000)
- `MONGODB_URI` : URL de connexion MongoDB
- `NODE_ENV` : Environnement (development/production)

#### MongoDB
- `MONGO_INITDB_ROOT_USERNAME` : Utilisateur admin
- `MONGO_INITDB_ROOT_PASSWORD` : Mot de passe admin
- `MONGO_INITDB_DATABASE` : Base de données par défaut

## 🧪 Tests

```bash
# Tests backend (à implémenter)
cd backend
npm test

# Tests frontend (à implémenter)
cd frontend
npm test
```

## 📊 Monitoring et Logs

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

## 🔒 Sécurité

- Utilisateur non-root dans les conteneurs
- Variables d'environnement pour les secrets
- Headers de sécurité dans Nginx
- Validation des données côté serveur

## 🚀 Déploiement en Production

1. **Configurer les variables d'environnement**
2. **Utiliser un reverse proxy (Nginx/Traefik)**
3. **Configurer SSL/TLS**
4. **Sauvegarder la base de données**
5. **Monitoring et alertes**

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Consulter la documentation
- Vérifier les logs Docker

## 🎯 Roadmap

- [ ] Authentification utilisateur
- [ ] Catégories de tâches
- [ ] Dates d'échéance
- [ ] Notifications
- [ ] API REST avancée
- [ ] Tests automatisés
- [ ] CI/CD pipeline

---

**Développé avec ❤️ en utilisant Express.js, Angular et Docker**
