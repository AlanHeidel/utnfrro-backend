#!/bin/bash

echo "================================"
echo "TESTING BACKEND API ENDPOINTS"
echo "================================"
echo ""

BASE_URL="http://localhost:3000/api"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Testing: $description${NC}"
    echo "Method: $method | Endpoint: $endpoint"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ SUCCESS (HTTP $http_code)${NC}"
    else
        echo -e "${RED}✗ FAILED (HTTP $http_code)${NC}"
    fi
    
    echo "Response: $body"
    echo ""
}

echo "================================"
echo "1. TESTING PLATOS"
echo "================================"
test_endpoint "GET" "/platos" "" "Get all platos"
test_endpoint "GET" "/platos/1" "" "Get plato by ID"
test_endpoint "POST" "/platos" '{"nombre":"Test Plato","precio":1000,"ingredientes":["test"],"tipoPlato":{"idTipoPlato":"1","nombre":"Entrada"},"imagen":"test.jpg"}' "Create plato"

echo "================================"
echo "2. TESTING MESAS"
echo "================================"
test_endpoint "GET" "/mesas" "" "Get all mesas"
test_endpoint "GET" "/mesas/1" "" "Get mesa by ID"
test_endpoint "POST" "/mesas" '{"numero":10,"capacidad":4,"estado":"disponible"}' "Create mesa"
test_endpoint "PATCH" "/mesas/1" '{"estado":"ocupada"}' "Update mesa status"

echo "================================"
echo "3. TESTING CLIENTES"
echo "================================"
test_endpoint "GET" "/clientes" "" "Get all clientes"
test_endpoint "GET" "/clientes/1" "" "Get cliente by ID"
test_endpoint "POST" "/clientes" '{"nombre":"Test","apellido":"Cliente","telefono":"123456","email":"test@test.com","dni":"99999999"}' "Create cliente"

echo "================================"
echo "4. TESTING MOZOS"
echo "================================"
test_endpoint "GET" "/mozos" "" "Get all mozos"
test_endpoint "GET" "/mozos/1" "" "Get mozo by ID"
test_endpoint "POST" "/mozos" '{"nombre":"Test","apellido":"Mozo","telefono":"123456","email":"testmozo@test.com","dni":"88888888"}' "Create mozo"

echo "================================"
echo "5. TESTING RESERVAS"
echo "================================"
test_endpoint "GET" "/reservas" "" "Get all reservas"
test_endpoint "GET" "/reservas/1" "" "Get reserva by ID"

echo "================================"
echo "6. TESTING PEDIDOS"
echo "================================"
test_endpoint "GET" "/pedidos" "" "Get all pedidos"
test_endpoint "GET" "/pedidos/1" "" "Get pedido by ID"

echo "================================"
echo "TESTING COMPLETED"
echo "================================"
