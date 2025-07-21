# Vexere RAG Chatbot

## About The Project

This project is a web application for a vehicle ticket booking service, featuring an advanced FAQ chatbot. The frontend is built with **Vite + React**, and the backend is powered by **FastAPI**.

The core feature is the RAG (Retrieval-Augmented Generation) chatbot that answers user questions based on a provided knowledge base (`faq_data.csv`). It uses `pgvector` for efficient similarity search and `Ollama` to serve a powerful language model for generating human-like answers.

### Tech Stack

-   **Frontend**: Vite, React.js
-   **Backend**: FastAPI, Python 3.10
-   **Database**: PostgreSQL with `pgvector` extension
-   **AI / ML**:
    -   **LLM**: `qwen` (served via Ollama)
    -   **Text Embeddings**: `all-MiniLM-L6-v2`
-   **Containerization**: Docker & Docker Compose

## Project Structure
```
vexere/
├── backend/
│   ├── api/
│   ├── schemas/
│   ├── services/
│   ├── scripts/
│   ├── .env
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── faq_data.csv
├── docker-compose.yml
├── README.md
├── CODE_REVIEW.md
├── run.bat
└── run.sh
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have the following software installed:
-   **Git**: For cloning the repository.
-   **Docker & Docker Compose**: For running the database and LLM services.
-   **Python 3.10+**: For the backend setup.
-   **Node.js 18+ & npm**: For the frontend setup.

### Installation & Setup

1.  **Clone the repository**
    ```sh
    git clone https://github.com/your-username/vexere.git
    cd vexere
    ```

2.  **Create the FAQ data file**
    Create a file named `faq_data.csv` in the project root and add your question-answer pairs.

3.  **Configure Backend Environment Variables**
    The backend relies on a `.env` file for configuration. The provided run scripts set these automatically, but you can create a `backend/.env` file to override them if needed.

    **`backend/.env`**
    ```
    # This URL is for communication between the backend container and the db container
    DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/vexere
    
    # This URL is for communication between the backend container and the ollama container
    OLLAMA_API_BASE_URL=http://ollama:11434
    
    # Model configuration
    OLLAMA_MODEL=qwen2:7b
    EMBEDDING_MODEL_NAME=all-MiniLM-L6-v2
    ```
    
## Running the Application

Automated scripts are provided to handle the entire setup and execution process.

#### For Linux/macOS

1.  **Make the script executable:**
    ```sh
    chmod +x run.sh
    ```
2.  **Run the script:**
    ```sh
    ./run.sh
    ```

#### For Windows

1.  **Run the script directly from the command line or by double-clicking it:**
    ```bat
    run.bat
    ```

### What the Run Script Does

1.  **Starts Docker Services**: Launches the `PostgreSQL/pgvector` and `Ollama` containers in the background.
2.  **Pulls LLM Model**: Downloads the `qwen2:7b` model into Ollama if it's not already present. This may take some time on the first run.
3.  **Sets up Backend**: Creates a Python virtual environment and installs all required dependencies.
4.  **Populates Database**: Runs the `embed_faq.py` script to load, embed, and store the FAQ data into the database. This step is skipped if data already exists.
5.  **Starts Servers**: Launches the FastAPI backend server and the Vite frontend development server.

## Accessing the Application

-   **Website**: Navigate to `http://localhost:5173`
-   **Backend API Docs**: The FastAPI interactive documentation is available at `http://localhost:8000/docs`

## Stopping the Application

-   **On Linux/macOS**: Press `Ctrl+C` in the terminal running the script. This will stop the frontend, backend, and the Docker containers.
-   **On Windows**: Close the `Frontend` and `Backend` terminal windows. Then, stop the Docker services by running `docker-compose down` in the project root.

## Further Development

For guidelines on code style, testing, and future improvements, please see [CODE_REVIEW.md](CODE_REVIEW.md).````