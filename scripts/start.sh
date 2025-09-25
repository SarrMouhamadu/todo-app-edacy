#!/bin/bash

# Script de démarrage pour l'application Todo
echo "🚀 Démarrage de l'application Todo..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# Construire et démarrer les services
echo "🔨 Construction et démarrage des services..."
docker-compose up -d --build

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier le statut des services
echo "📊 Statut des services:"
docker-compose ps

# Afficher les URLs d'accès
echo ""
echo "✅ Application démarrée avec succès!"
echo ""
echo "🌐 URLs d'accès:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:3000"
echo "   MongoDB: localhost:27017"
echo ""
echo "📋 Commandes utiles:"
echo "   Voir les logs: docker-compose logs -f"
echo "   Arrêter: docker-compose down"
echo "   Redémarrer: docker-compose restart"
echo ""
echo "🎉 Bon développement!"
