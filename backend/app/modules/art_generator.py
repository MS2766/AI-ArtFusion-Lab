from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline
from PIL import Image, ImageEnhance, ImageFilter
import torch
import logging
import os
import time

router = APIRouter()

logging.basicConfig(level=logging.INFO)

class ArtRequest(BaseModel):
    prompt: str

# Initialize model once
model_id = "runwayml/stable-diffusion-v1-5"
device = "cuda" if torch.cuda.is_available() else "cpu"
logging.info("Loading the model...")
pipeline = StableDiffusionPipeline.from_pretrained(model_id).to(device)
logging.info("Model loaded successfully.")

@router.post("/")
def generate_art(request: ArtRequest):
    logging.info(f"Received request with prompt: {request.prompt}")
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    try:
        # Generate image with more steps and a higher guidance scale for better clarity
        image = pipeline(request.prompt).images[0]

        # Enhance image
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2)

        # Save image
        timestamp = int(time.time())
        image_path = f"generated_images/{timestamp}.png"
        os.makedirs(os.path.dirname(image_path), exist_ok=True)
        image.save(image_path)

        logging.info(f"Image saved at {image_path}")
        return {"image_path": image_path}
    except Exception as e:
        logging.error(f"Error generating art: {e}")
        raise HTTPException(status_code=500, detail="Error generating art")