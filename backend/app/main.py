from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import qrcode
from io import BytesIO
import base64

from . import models, database, routes, websocket, quiz_engine
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Technical Quiz API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Technical Quiz API is running", "version": "1.1.0"}

# Include routers
app.include_router(routes.router)
app.include_router(websocket.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
