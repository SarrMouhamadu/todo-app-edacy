#!/bin/bash

echo "🧪 Test de l'API Todo App"
echo "========================="

# Test 1: Vérifier que l'API répond
echo "1. Test de l'endpoint principal..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
if [ "$response" = "200" ]; then
    echo "✅ API principale accessible"
else
    echo "❌ API principale non accessible (code: $response)"
fi

# Test 2: Récupérer tous les todos
echo "2. Test de récupération des todos..."
todos=$(curl -s http://localhost:3000/api/todos)
if [ $? -eq 0 ]; then
    echo "✅ Récupération des todos réussie"
    echo "📋 Nombre de todos: $(echo $todos | jq '. | length')"
else
    echo "❌ Erreur lors de la récupération des todos"
fi

# Test 3: Créer un nouveau todo
echo "3. Test de création d'un todo..."
new_todo=$(curl -s -X POST http://localhost:3000/api/todos \
    -H "Content-Type: application/json" \
    -d '{"title":"Test API","description":"Todo créé par le script de test"}')
if [ $? -eq 0 ]; then
    echo "✅ Création de todo réussie"
    todo_id=$(echo $new_todo | jq -r '._id')
    echo "🆔 ID du todo créé: $todo_id"
else
    echo "❌ Erreur lors de la création du todo"
fi

# Test 4: Mettre à jour le todo
if [ ! -z "$todo_id" ] && [ "$todo_id" != "null" ]; then
    echo "4. Test de mise à jour du todo..."
    updated_todo=$(curl -s -X PUT http://localhost:3000/api/todos/$todo_id \
        -H "Content-Type: application/json" \
        -d '{"completed":true}')
    if [ $? -eq 0 ]; then
        echo "✅ Mise à jour du todo réussie"
    else
        echo "❌ Erreur lors de la mise à jour du todo"
    fi
fi

# Test 5: Supprimer le todo
if [ ! -z "$todo_id" ] && [ "$todo_id" != "null" ]; then
    echo "5. Test de suppression du todo..."
    delete_response=$(curl -s -X DELETE http://localhost:3000/api/todos/$todo_id)
    if [ $? -eq 0 ]; then
        echo "✅ Suppression du todo réussie"
    else
        echo "❌ Erreur lors de la suppression du todo"
    fi
fi

# Test 6: Vérifier le frontend
echo "6. Test du frontend..."
frontend_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
if [ "$frontend_response" = "200" ]; then
    echo "✅ Frontend accessible"
else
    echo "❌ Frontend non accessible (code: $frontend_response)"
fi

echo ""
echo "🎉 Tests terminés !"
echo ""
echo "🌐 URLs d'accès:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:3000"
echo "   MongoDB: localhost:27017"
