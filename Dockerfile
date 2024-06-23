# 使用官方的Python映像作为基础映像
FROM python:3.10-buster

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY requirements.txt /app/

# 安装依赖
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r /app/requirements.txt

# 复制当前目录内容到工作目录
COPY . /app/

# 复制示例图片到 /app/example 目录
COPY example/example.png /app/example/example.png

# 暴露端口
EXPOSE 8000

# 运行应用
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
