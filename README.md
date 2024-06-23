# DeepDanbooru Webui Docker

[Docker Hub(nrdy)()]
| [API documentation(nrdy)]
| [Web tool(nrdy)]

Dockerized web-based interface for DeepDanbooru, an image tagger for anime-style images.

This project is inspired by and references [nanoskript/deepdanbooru-docker](https://github.com/nanoskript/deepdanbooru-docker). It uses the [deepdanbooru-onnx](https://pypi.org/project/deepdanbooru-onnx/) library ([GitHub repository](https://github.com/chinoll/deepdanbooru_onnx)) which converts the original TensorFlow model into an ONNX model.

## Features

- Web-based interface to upload and tag images
- Outputs tags in both individual and comma-separated string formats
- Dockerized for easy deployment
- Supports both WebUI and API in one Container

## Prerequisites

- Docker
- Git

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:YourUsername/deepdanbooru-docker-webui.git
   cd deepdanbooru-docker-webui

2. Ensure you have the model files in the models directory(default in LFS)

    deepdanbooru.onnx
    tags.txt
    If you don't have these files, you can download them from Hugging Face.
    [Model file](https://huggingface.co/chinoll/deepdanbooru/resolve/main/deepdanbooru.onnx)
    [tags file](https://huggingface.co/chinoll/deepdanbooru/resolve/main/tags.txt)

3. Build the Docker image:

    ```bash
    docker build -t deepdanbooru-docker-webui .

4. Run the Docker container:

    ```bash
    docker run -p 43180:43180 deepdanbooru-docker-webui