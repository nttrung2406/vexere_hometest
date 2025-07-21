@echo off
rem A script to build and run the entire application using Docker Compose.

echo --- Building Docker images (if necessary) ---
docker-compose build
if %errorlevel% neq 0 (
    echo Docker build failed.
    exit /b %errorlevel%
)

echo --- Starting all services in detached mode ---
docker-compose up -d
if %errorlevel% neq 0 (
    echo Docker-compose up failed.
    exit /b %errorlevel%
)

echo --- Waiting for services to initialize... ---
timeout /t 15 /nobreak > nul

echo --- Checking/Pulling Ollama model (qwen2:7b) ---
docker-compose exec ollama ollama list | findstr "qwen2:7b" > nul
if %errorlevel% neq 0 (
    echo Model not found. Pulling qwen2:7b... (This may take a while)
    docker-compose exec ollama ollama pull qwen2:7b
) else (
    echo Ollama model 'qwen2:7b' already exists.
)

echo --- Running database embedding script inside the 'backend' container ---
docker-compose exec backend python scripts/embed_faq.py
if %errorlevel% neq 0 (
    echo Failed to run embedding script.
    exit /b %errorlevel%
)

echo.
echo --- [SUCCESS] All services are up and running! ---
echo.
echo You can access the application at:
echo   - Frontend Website: http://localhost:5173
echo   - Backend API Docs: http://localhost:8000/docs
echo.
echo To view live logs for all services, run:
echo   docker-compose logs -f
echo.
echo To stop all services, run:
echo   docker-compose down
echo.
