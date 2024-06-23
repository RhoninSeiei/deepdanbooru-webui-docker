import io
import os
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from deepdanbooru_onnx import DeepDanbooru
from PIL import Image

app = FastAPI(title="deepdanbooru-docker")
app.add_middleware(CORSMiddleware, allow_origins=["*"])

# 添加模板和静态文件支持
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

threshold = float(os.environ.get("DEEPDANBOORU_THRESHOLD") or "0.5")
model_path = os.environ.get("DEEPDANBOORU_MODEL_PATH", "/models/deepdanbooru.onnx")
tags_path = os.environ.get("DEEPDANBOORU_TAGS_PATH", "/models/tags.txt")

# 初始化 DeepDanbooru 实例，直接使用本地模型文件
deepdanbooru = DeepDanbooru(model_path=model_path, tags_path=tags_path, threshold=threshold)

class Result(BaseModel):
    tag: str
    score: float

@app.get("/")
async def route_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/deepdanbooru")
async def route_deepdanbooru(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    results = deepdanbooru(image)
    results = [Result(tag=tag, score=float(score)) for tag, score in results.items()]
    results.sort(key=lambda result: result.score, reverse=True)
    return results
