from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from backend.schemas.chat import ChatRequest
from backend.services.rag_service import rag_service
from backend.database import get_db

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(chat_request: ChatRequest, db: Session = Depends(get_db)):
    user_embedding = rag_service.get_embedding(chat_request.question)
    relevant_faqs = rag_service.find_relevant_faqs(db, user_embedding, top_k=3)
    
    prompt = rag_service.build_prompt(chat_request.question, relevant_faqs)
    
    return StreamingResponse(
        rag_service.get_ollama_response_stream(prompt),
        media_type="text/event-stream"
    )