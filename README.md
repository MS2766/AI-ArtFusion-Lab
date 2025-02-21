# 🎨 AI ArtFusion Lab - AI-Powered Art Generation & Style Transfer  

## Overview  
AI ArtFusion Lab is a web application that uses AI to generate stunning artworks and apply style transfer techniques to images. Powered by **FastAPI**, **React**, and **PyTorch**, it offers a seamless way to create and transform art using deep learning models.

## Features  
✅ **AI Art Generation** - Generate unique images from text prompts.  
✅ **Style Transfer** - Apply artistic styles to images using deep learning.  
✅ **FastAPI Backend** - High-performance API for handling AI tasks.  
✅ **React Frontend** - A responsive UI for a smooth user experience.  
✅ **Docker Support** - Easily deployable with Docker & Kubernetes.  

## Tech Stack  
🔹 **Frontend:** React, React Router, CSS  
🔹 **Backend:** FastAPI, PyTorch, Pillow, torchvision  
🔹 **Database:** PostgreSQL (if applicable)  
🔹 **Deployment:** Docker, Kubernetes, GitHub Actions  

## Installation & Setup  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/your-username/AI-ArtFusionLab.git
cd AI-ArtFusion-Lab
```

### 2️⃣ Backend Setup  
#### Install Dependencies  
```bash
cd backend
pip install -r requirements.txt
```

#### Run FastAPI Server  
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3️⃣ Frontend Setup  
#### Install Dependencies  
```bash
cd frontend
npm install
```

#### Run React App  
```bash
npm start
```

## Usage  
- **Art Generation:** Enter a text prompt and let the AI generate an artwork.  
- **Style Transfer:** Upload a content image and a style image to create a fusion of both.  
- **Save & Share:** Download and showcase your AI-generated artwork.

## API Endpoints  
| Method | Endpoint | Description |
|--------|---------|------------|
| `POST` | `/art-generation/` | Generates AI artwork from text |
| `POST` | `/style-transfer/` | Transfers artistic style to an image |

## Contributing  
1. **Fork** the repository.  
2. **Create a branch** (`git checkout -b feature-branch`).  
3. **Commit changes** (`git commit -m "Added new feature"`).  
4. **Push** (`git push origin feature-branch`).  
5. **Open a pull request** on GitHub.
