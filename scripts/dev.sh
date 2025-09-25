#!/bin/bash

# Script de développement pour l'application Todo
echo "🔧 Mode développement - Todo App"

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Démarrer seulement MongoDB en arrière-plan
echo "🗄️ Démarrage de MongoDB..."
docker-compose up -d mongodb

# Attendre que MongoDB soit prêt
echo "⏳ Attente du démarrage de MongoDB..."
sleep 5

# Instructions pour le développement
echo ""
echo "✅ MongoDB démarré en mode développement!"
echo ""
echo "📋 Instructions:"
echo "   1. Ouvrez un terminal pour le backend:"
echo "      cd backend && npm install && npm run dev"
echo ""
echo "   2. Ouvrez un autre terminal pour le frontend:"
echo "      cd frontend && npm install && npm start"
echo ""
echo "🌐 URLs d'accès:"
echo "   Frontend: http://localhost:4200"
echo "   Backend API: http://localhost:3000"
echo "   MongoDB: localhost:27017"
echo ""
echo "🛑 Pour arrêter MongoDB:"
echo "   docker-compose stop mongodb"
echo ""
echo "🎉 Bon développement!"
