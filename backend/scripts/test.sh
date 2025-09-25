#!/bin/bash

# Script de test pour l'API Todo
echo "🧪 Démarrage des tests..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Installer les dépendances de test si nécessaire
if [ ! -d "node_modules/mongodb-memory-server" ]; then
    echo "📦 Installation des dépendances de test..."
    npm install --save-dev mongodb-memory-server
fi

# Exécuter les tests
echo "🚀 Exécution des tests..."
npm test

# Vérifier le code de sortie
if [ $? -eq 0 ]; then
    echo "✅ Tous les tests sont passés avec succès!"
else
    echo "❌ Certains tests ont échoué"
    exit 1
fi
