import os
import aiohttp
import json
from sqlalchemy.orm import Session
from sqlalchemy import text, insert
from sentence_transformers import SentenceTransformer
from pgvector.sqlalchemy import Vector
from sqlalchemy import Table, Column, Integer, String, Index
from backend.database import Base, engine

class FaqEntry(Base):
    __tablename__ = 'faq_entries'
    id = Column(Integer, primary_key=True, autoincrement=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    embedding = Column(Vector(384), nullable=False)

    __table_args__ = (
        Index(
            'ix_faq_entries_embedding',
            'embedding',
            postgresql_using='ivfflat',
            postgresql_with={'lists': 100}
        ),
    )


class RAGService:
    def __init__(self):
        self.embed_model_name = os.getenv("EMBEDDING_MODEL_NAME")
        self.ollama_api_url = f"{os.getenv('OLLAMA_API_BASE_URL')}/api/generate"
        self.ollama_model = os.getenv("OLLAMA_MODEL")
        
        print("Loading embedding model...")
        self.embedding_model = SentenceTransformer(self.embed_model_name)
        print("Embedding model loaded.")

    def get_embedding(self, text: str):
        return self.embedding_model.encode(text)

    def find_relevant_faqs(self, db: Session, user_embedding, top_k: int = 3):
        results = db.query(FaqEntry).order_by(FaqEntry.embedding.l2_distance(user_embedding)).limit(top_k).all()
        return results

    def build_prompt(self, question: str, context_faqs: list[FaqEntry]):
        context = "\n\n".join([f"Q: {faq.question}\nA: {faq.answer}" for faq in context_faqs])
        prompt = f"""
        Dựa vào ngữ cảnh được cung cấp sau đây, hãy trả lời câu hỏi của người dùng một cách ngắn gọn và hữu ích.
        Chỉ sử dụng thông tin từ ngữ cảnh. Nếu câu trả lời không có trong ngữ cảnh, hãy nói: 'Xin lỗi, tôi không tìm thấy thông tin cho câu hỏi này.'

        Ngữ cảnh:
        {context}

        Câu hỏi người dùng: {question}

        Trả lời:
        """
        return prompt

    async def get_ollama_response_stream(self, prompt: str):
        payload = {
            "model": self.ollama_model,
            "prompt": prompt,
            "stream": True,
        }
        async with aiohttp.ClientSession() as session:
            async with session.post(self.ollama_api_url, json=payload) as response:
                if response.status != 200:
                    error_text = await response.text()
                    print(f"Error from Ollama: {error_text}")
                    yield f"data: {{ \"error\": \"Error from Ollama: {error_text}\" }}\n\n"
                    return

                async for line in response.content:
                    if line:
                        try:
                            json_line = json.loads(line.decode('utf-8'))
                            if json_line.get("response"):
                                yield f"data: {json.dumps({'token': json_line['response']})}\n\n"
                        except json.JSONDecodeError:
                            continue 

rag_service = RAGService()