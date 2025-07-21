# Code Review & Development Guidelines

This document provides a set of guidelines for maintaining code quality, testing procedures, and future development directions for the Vexere RAG project.

## 1. Code Style Conventions

Consistency is key to a readable and maintainable codebase.

### Python (Backend)

-   **Formatting**: All Python code **must** be formatted using `black`.
-   **Linting**: Code should adhere to PEP 8 standards, enforced by a linter like `ruff` or `flake8`. We recommend `ruff` for its speed and comprehensive checks.
    ```bash
    # Example commands
    black backend/
    ruff check backend/
    ```
-   **Imports**: Imports should be sorted using `isort` or the equivalent rule in `ruff`. They should be grouped as follows: standard library, third-party libraries, and then local application imports.
-   **Typing**: All function signatures and class variables **must** include type hints (`str`, `int`, `Session`, etc.). This is crucial for FastAPI's dependency injection and for static analysis.
-   **Docstrings**: Use Google-style docstrings for all public modules, classes, and functions to explain their purpose, arguments, and return values.

### JavaScript/React (Frontend)

-   **Formatting**: All `.js`, `.jsx`, `.css`, and `.json` files **must** be formatted using `Prettier`.
-   **Linting**: Use `ESLint` with standard configurations like `eslint-plugin-react` and `eslint-plugin-react-hooks` to catch common errors and enforce best practices.
-   **Component Naming**: Components must be named using `PascalCase` (e.g., `BookingForm.jsx`).
-   **File Structure**: Keep components in the `src/components` directory. For more complex components, consider co-locating their specific styles and hooks in a dedicated folder (e.g., `src/components/ChatWidget/`).

## 2. Testing & CI

The project currently lacks an automated testing suite, which is a top priority for future development.

### Testing Strategy

-   **Backend (pytest)**:
    -   **Unit Tests**: Test individual functions in isolation (e.g., test the `build_prompt` function in `rag_service.py` by providing mock data). External services like the database or Ollama API should be mocked.
    -   **Integration Tests**: Use FastAPI's `TestClient` to test API endpoints. These tests can run against a dedicated test database to verify the full request/response cycle.

-   **Frontend (Vitest + React Testing Library)**:
    -   **Component Tests**: Test individual React components to ensure they render correctly and respond to user interaction (e.g., test that the chat window opens when the button is clicked).
    -   **E2E Tests (Optional but Recommended)**: Use a framework like `Cypress` or `Playwright` to simulate a full user journey.

### Continuous Integration (CI)

A CI pipeline should be set up using **GitHub Actions**. A basic `.github/workflows/ci.yml` would:
1.  Trigger on `push` and `pull_request` to the `main` branch.
2.  Set up Node.js and Python environments.
3.  Install dependencies (`npm install`, `pip install -r requirements.txt`).
4.  Run linters and format checkers (`prettier --check`, `ruff check`, `black --check`).
5.  Run the entire test suite (`npm test`, `pytest`).

## 3. Weaknesses & Expansion Directions

### Current Weaknesses

1.  **Stateless Chat**: The RAG service is stateless. It has no memory of previous questions, making follow-up questions impossible.
2.  **Configuration Management**: The frontend hardcodes the backend URL (`http://localhost:8000`). This should be managed through environment variables (e.g., `VITE_API_URL`).
3.  **Error Handling**: Error handling is minimal. If the Ollama service fails, the user sees a generic error. The system needs more robust logging and user-facing error messages.
4.  **Static Data Source**: The FAQ data is from a static `faq_data.csv`. Updating it requires re-running the embedding script manually.
5.  **Security**: CORS is configured for development. For production, it needs to be locked down to a specific domain. There is no input sanitization beyond what the frameworks provide.

### Expansion Directions

1.  **Stateful Conversations**:
    -   Introduce a `conversations` table in the database.
    -   Pass a `conversation_id` between the frontend and backend.
    -   Store chat history and include recent turns in the prompt sent to the LLM to provide context.

2.  **Advanced RAG Pipeline**:
    -   **Re-ranking**: After retrieving the top-k documents with vector search, use a more powerful (but slower) cross-encoder model to re-rank the results for better relevance.
    -   **Hybrid Search**: Combine vector search with traditional keyword-based search (e.g., BM25) to get the best of both worlds.

3.  **Dynamic Data Management**:
    -   Create a simple admin interface (or a separate microservice) where non-technical users can add, edit, or delete FAQs.
    -   This interface would trigger an automated pipeline to update the embeddings in the `pgvector` database.

4.  **Production-Ready Deployment**:
    -   Create optimized, multi-stage Dockerfiles for both the frontend (serving static files via Nginx) and backend (running with Gunicorn).
    -   Move environment variables and secrets to a secure secret management system.

5.  **Monitoring and Logging**:
    -   Integrate a structured logging library into the FastAPI backend.
    -   Add basic monitoring to track API response times, error rates, and resource usage.