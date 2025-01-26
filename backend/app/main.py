from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.modules import auth, art_generator, style_transfer
from app.database import engine
from app.models import Base

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Create the database tables
Base.metadata.create_all(bind=engine)

# Serve static files
app.mount("/generated_images", StaticFiles(directory="generated_images"), name="generated_images")

# Include routers from different modules
app.include_router(auth.router, prefix="/auth")
app.include_router(art_generator.router, prefix="/art-generation")
app.include_router(style_transfer.router, prefix="/style-transfer")
