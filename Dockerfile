FROM python:3.10-buster

WORKDIR /app

# 复制需求文件
COPY requirements.txt /app/

# 更新 pip、setuptools 和 wheel，并安装依赖项
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r /app/requirements.txt

# 复制本地下载的模型文件到 /models/ 目录
COPY models/deepdanbooru.onnx /models/deepdanbooru.onnx
COPY models/tags.txt /models/tags.txt

# 打印安装包列表（调试用）
RUN pip list

# 复制应用代码
COPY . .

# 设置模型文件的环境变量
ENV DEEPDANBOORU_MODEL_PATH=/models/deepdanbooru.onnx
ENV DEEPDANBOORU_TAGS_PATH=/models/tags.txt

# 暴露新端口
EXPOSE 43180

# 运行应用
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "43180"]
