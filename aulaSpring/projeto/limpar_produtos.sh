#!/bin/bash

echo "🗑️  Limpando todos os produtos..."

# Listar IDs de todos os produtos
PRODUTOS=$(curl -s http://localhost:8080/api/produtos | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

if [ -z "$PRODUTOS" ]; then
  echo "✅ Nenhum produto para deletar"
  exit 0
fi

# Deletar cada produto
for ID in $PRODUTOS; do
  curl -s -X DELETE http://localhost:8080/api/produtos/$ID
  echo "🗑️  Produto $ID deletado"
done

echo "✅ Todos os produtos foram deletados!"
echo ""
echo "Verificando..."
curl -s http://localhost:8080/api/produtos | grep -q '\[\]' && echo "✅ Banco vazio!" || echo "⚠️  Alguns produtos ainda existem"
