#!/bin/bash

set -e

echo "--- Building Docker images (if necessary) ---"
docker-compose build

echo "--- Starting all services in detached mode ---"
docker-compose up -d

echo "--- Waiting for the database to be ready... ---"
until docker-compose exec db pg_isready -U postgres -d vexere > /dev/null 2>&1; do
    echo "Database is unavailable - sleeping"
    sleep 2
done
echo "--- Database is ready! ---"

echo "--- Checking/Pulling Ollama model (qwen2:7b) ---"
if ! docker-compose exec ollama ollama list | grep -q "qwen2:7b"; then
    echo "Model not found. Pulling qwen2:7b... (This may take a while)"
    docker-compose exec ollama ollama pull qwen2:7b
else
    echo "Ollama model 'qwen2:7b' already exists."
fi

echo "--- Running database embedding script inside the 'backend' container ---"
docker-compose exec backend python scripts/embed_faq.py

echo "--- All services are up and running! ---"
echo ""
echo "You can access the application at:"
echo "  - Frontend Website: http://localhost:5173"
echo "  - Backend API Docs: http://localhost:8000/docs"
echo ""
echo "To view live logs for all services, run:"
echo "  docker-compose logs -f"
echo ""
echo "To stop all services, run:"
echo "  docker-compose down"
echo ""

