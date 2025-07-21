from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import chat

app = FastAPI(title="Vexere RAG Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Vexere RAG API!"}