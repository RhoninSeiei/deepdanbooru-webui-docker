import io
import os

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from PIL import Image
import numpy as np
import tensorflow as tf
import uvicorn
from deepdanbooru_onnx import DeepDanbooru

app = FastAPI(title="deepdanbooru-docker")

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/example", StaticFiles(directory="example"), name="example")
templates = Jinja2Templates(directory="templates")

# 模型和标签文件路径
model_path = "/app/models/deepdanbooru.onnx"
tags_path = "/app/models/tags.txt"
threshold = float(os.environ.get("DEEPDANBOORU_THRESHOLD") or "0.5")

deepdanbooru = DeepDanbooru(model_path=model_path, tags_path=tags_path, threshold=threshold)

def transform_and_pad_image(image, target_width, target_height):
    height, width, _ = image.shape
    scale = min(target_width / width, target_height / height)
    new_width = int(scale * width)
    new_height = int(scale * height)
    
    resized_image = tf.image.resize(image, (new_height, new_width), method=tf.image.ResizeMethod.AREA).numpy()
    
    padded_image = np.zeros((target_height, target_width, 3), dtype=np.float32)
    padded_image[:new_height, :new_width, :] = resized_image
    
    return padded_image

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/tag/")
async def tag_image(file: UploadFile = File(...)):
    image = await file.read()
    image = Image.open(io.BytesIO(image)).convert("RGB")
    image = np.array(image).astype(np.float32) / 255.0  # 转换为浮点数并归一化

    width, height = 512, 512  # 设置目标宽度和高度
    image = transform_and_pad_image(image, width, height)

    results = deepdanbooru(image[None, ...])

    tags = [f"{tag} ({score:.2f})" for tag, score in results.items() if score > 0.5]
    tag_string = ", ".join([tag.split(' ')[0] for tag in tags])  # 获取tag名称部分，并用逗号分隔

    return {"tags": tags, "tag_string": tag_string}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
