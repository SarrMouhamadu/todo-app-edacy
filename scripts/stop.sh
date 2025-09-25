#!/bin/bash

# Script d'arrêt pour l'application Todo
echo "🛑 Arrêt de l'application Todo..."

# Arrêter tous les services
docker-compose down

# Optionnel: supprimer les volumes (décommentez si nécessaire)
# echo "🗑️ Suppression des volumes..."
# docker-compose down -v

# Optionnel: supprimer les images (décommentez si nécessaire)
# echo "🗑️ Suppression des images..."
# docker-compose down --rmi all

echo "✅ Application arrêtée avec succès!"
