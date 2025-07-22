#!/bin/bash

set -e

check_and_kill_port() {
  local port=$1
  echo "--- Checking if port $port is free ---"
  pid=$(lsof -ti tcp:$port || true)
  if [ -n "$pid" ]; then
    echo "Port $port is in use by PID $pid. Killing it..."
    kill -9 $pid
    echo "Port $port is now free."
  else
    echo "Port $port is free."
  fi
}

# 🔍 Check & kill ports used in docker-compose
check_and_kill_port 5432   # PostgreSQL
check_and_kill_port 8000   # FastAPI backend
check_and_kill_port 5173   # Vite frontend
check_and_kill_port 11434  # Ollama

echo "--- Building Docker images (if necessary) ---"
docker compose build

echo "--- Starting all services in detached mode ---"
docker compose up -d

echo "--- Waiting for the database to be ready... ---"
until docker compose exec db pg_isready -U postgres -d vexere > /dev/null 2>&1; do
    echo "Database is unavailable - sleeping"
    sleep 2
done
echo "--- Database is ready! ---"

echo "--- Checking/Pulling Ollama model (qwen3:1.7b) ---"
if ! docker compose exec ollama ollama list | grep -q "qwen3:1.7b"; then
    echo "Model not found. Pulling qwen3:1.7b... (This may take a while)"
    docker compose exec ollama ollama pull qwen3:1.7b
else
    echo "Ollama model 'qwen3:1.7b' already exists."
fi

echo "--- Running database embedding script inside the 'backend' container ---"
docker compose exec backend python -m backend.scripts.embed_faq

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
