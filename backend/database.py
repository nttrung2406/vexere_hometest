import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize the database and enable the vector extension."""
    with engine.connect() as connection:
        connection.execute(text('CREATE EXTENSION IF NOT EXISTS vector'))
        connection.commit()
    Base.metadata.create_all(bind=engine)
    print("Database initialized and 'vector' extension enabled.")

if __name__ == "__main__":
    print("Initializing database...")
    init_db()