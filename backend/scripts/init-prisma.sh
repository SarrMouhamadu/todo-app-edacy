#!/bin/bash

# Script d'initialisation de Prisma
echo "🚀 Initialisation de Prisma..."

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

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Vérifier la connexion à la base de données
echo "🔍 Vérification de la connexion à la base de données..."
npx prisma db push

# Afficher le statut de la base de données
echo "📊 Statut de la base de données:"
npx prisma db status

echo "✅ Initialisation de Prisma terminée!"
echo ""
echo "📝 Commandes utiles:"
echo "  - npx prisma studio    : Interface graphique de la base de données"
echo "  - npx prisma db push   : Synchroniser le schéma avec la base de données"
echo "  - npx prisma generate  : Régénérer le client Prisma"
echo "  - npx prisma db seed   : Peupler la base de données avec des données de test"
