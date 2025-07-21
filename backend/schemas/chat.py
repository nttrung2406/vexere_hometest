from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str
    conversation_id: str | None = None