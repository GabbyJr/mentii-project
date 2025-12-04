from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from .database import engine, Base, get_db
from .routes import users, chat, communities, resources, search
from .websocket import websocket_endpoint
from . import auth  # Import auth from the root app directory

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Mentii Backend Starting...")
    yield
    # Shutdown
    print("👋 Mentii Backend Shutting Down...")

app = FastAPI(
    title="Mentii API",
    description="Social Learning Platform API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for frontend - keep only one CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)  # auth.router is already defined with prefix="/api/auth" in auth.py
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(communities.router, prefix="/api/communities", tags=["Communities"])
app.include_router(resources.router, prefix="/api/resources", tags=["Resources"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])

# WebSocket endpoint
app.add_api_websocket_route("/ws", websocket_endpoint)

# Serve frontend static files
app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "mentii-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)