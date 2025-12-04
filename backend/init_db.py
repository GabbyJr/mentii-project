from app.database import engine, Base
from app.models import User, Post, Community, Message, Resource, Comment, UserProfile

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")