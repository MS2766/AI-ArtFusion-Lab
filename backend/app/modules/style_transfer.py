from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image
import torch
from torchvision import transforms
from torchvision.models import resnet50
from torch import nn
import torch.optim as optim
import logging
import os
import time

router = APIRouter()

logging.basicConfig(level=logging.INFO)

def image_loader(image, transform, device):
    image = transform(image).unsqueeze(0)
    return image.to(device, torch.float)

def gram_matrix(input):
    a, b, c, d = input.size()
    features = input.view(a * b, c * d)
    G = torch.mm(features, features.t())
    return G.div(a * b * c * d)

class StyleTransferModel(nn.Module):
    def __init__(self, content_img, style_img, device):
        super(StyleTransferModel, self).__init__()
        self.content_img = content_img
        self.style_img = style_img
        self.device = device
        self.resnet = resnet50(weights='IMAGENET1K_V1').to(device).eval()
        self.content_layers = ['layer1', 'layer2', 'layer3', 'layer4']
        self.style_layers = ['layer1', 'layer2', 'layer3', 'layer4']
        self.model = nn.Sequential()
        self.content_losses = []
        self.style_losses = []
        for name, layer in self.resnet.named_children():
            self.model.add_module(name, layer)
            if name in self.content_layers:
                target = self.model(self.content_img).detach()
                content_loss = nn.MSELoss()
                self.content_losses.append((content_loss, target))
            if name in self.style_layers:
                target_feature = self.model(self.style_img).detach()
                target_gram = gram_matrix(target_feature)
                style_loss = nn.MSELoss()
                self.style_losses.append((style_loss, target_gram))

    def forward(self, x):
        content_score = torch.tensor(0.0, requires_grad=True, device=self.device)
        style_score = torch.tensor(0.0, requires_grad=True, device=self.device)
        for name, module in self.model.named_children():
            x = module(x)
            if name in self.content_layers:
                target = self.content_losses[0][1]
                content_score += nn.MSELoss()(x, target)
            if name in self.style_layers:
                target_gram = self.style_losses[0][1]
                style_score += nn.MSELoss()(gram_matrix(x), target_gram)
        return content_score, style_score

@router.post("/")
async def transfer_style(content_image: UploadFile = File(...), style_image: UploadFile = File(...)):
    try:
        content_image = Image.open(content_image.file).convert("RGB")
        style_image = Image.open(style_image.file).convert("RGB")

        transform = transforms.Compose([
            transforms.Resize((512, 512)),
            transforms.ToTensor()
        ])

        device = "cuda" if torch.cuda.is_available() else "cpu"
        content_img = image_loader(content_image, transform, device)
        style_img = image_loader(style_image, transform, device)

        input_img = content_img.clone().requires_grad_(True).to(device)

        model = StyleTransferModel(content_img, style_img, device)
        optimizer = optim.LBFGS([input_img])

        run = [0]
        while run[0] <= 300:
            def closure():
                with torch.no_grad():
                    input_img.clamp_(0, 1)
                optimizer.zero_grad()
                content_score, style_score = model(input_img)
                style_score *= 1000000
                loss = content_score + style_score
                loss.backward()
                run[0] += 1
                return loss

            optimizer.step(closure)

        with torch.no_grad():
            input_img = torch.clamp(input_img, 0, 1)
        styled_image = transforms.ToPILImage()(input_img.squeeze(0).cpu())
        timestamp = int(time.time())
        styled_image_path = os.path.join("generated_images", f"{timestamp}.png")
        os.makedirs(os.path.dirname(styled_image_path), exist_ok=True)
        styled_image.save(styled_image_path)

        return {"image_path": styled_image_path}
    except Exception as e:
        logging.error(f"Error in style transfer: {e}")
        raise HTTPException(status_code=500, detail=str(e))
