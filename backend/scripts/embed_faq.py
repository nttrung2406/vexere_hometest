import os
import pandas as pd
from sqlalchemy.orm import Session
from backend.database import SessionLocal, init_db, engine
from backend.services.rag_service import FaqEntry, rag_service

def load_data(filepath='faq_data.csv'):
    return pd.read_csv(filepath)

def embed_and_store_data():
    init_db()

    db: Session = SessionLocal()

    try:
        if db.query(FaqEntry).count() > 0:
            print("FAQ data already exists in the database. Skipping embedding.")
            return

        print("Loading FAQ data from CSV...")
        faq_data = load_data()
        
        print(f"Found {len(faq_data)} entries. Embedding and storing...")
        
        entries_to_add = []
        for index, row in faq_data.iterrows():
            question = row['question']
            answer = row['answer']
            
            combined_text = f"Question: {question} Answer: {answer}"
            embedding = rag_service.get_embedding(combined_text)
            
            entries_to_add.append(
                FaqEntry(question=question, answer=answer, embedding=embedding)
            )
            print(f"  - Embedded entry {index + 1}/{len(faq_data)}")

        db.add_all(entries_to_add)
        db.commit()
        print("Successfully stored all FAQ entries in the database.")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    embed_and_store_data()