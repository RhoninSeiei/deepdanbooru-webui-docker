# DeepDanbooru Webui Docker

[Docker Hub](https://hub.docker.com/r/rhoninseiei/deepdanbooru-webui-docker)
| [Web tool](https://animetagger.sphererapids.com/)

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

### Docker hub
1. use [Docker Hub](https://hub.docker.com/r/rhoninseiei/deepdanbooru-webui-docker)
   ```bash
   docker run -p 43180:8000 deepdanbooru-webui-docker

### Local build
1. Clone the repository:

   ```bash
   git clone github.com/RhoninSeiei/deepdanbooru-webui-docker.git
   cd deepdanbooru-webui-docker

2. Ensure you have the model files in the models directory(default in LFS)

    deepdanbooru.onnx
    tags.txt
    If you don't have these files, you can download them from Hugging Face.
    [Model file](https://huggingface.co/chinoll/deepdanbooru/resolve/main/deepdanbooru.onnx)
    [tags file](https://huggingface.co/chinoll/deepdanbooru/resolve/main/tags.txt)

3. Build the Docker image:

    ```bash
    docker build -t deepdanbooru-webui-docker .

4. Run the Docker container:

    ```bash
    docker run -p 43180:8000 deepdanbooru-webui-docker

## API Endpoints

### Image Tagging API

- **URL**: `/tag/`
- **Method**: `POST`
- **Description**: Upload an image to get tags and a comma-separated string of tags.
- **Request Parameters**:
  - `file`: The image file to be uploaded (type: `UploadFile`).

- **Response**:
  - `tags`: An array of tags with their respective scores.
  - `tag_string`: A comma-separated string of the tags.

## API Usage

To use the API endpoints, send a `POST` request with an image file as the `file` parameter. The response will contain an array of tags with their respective scores and a comma-separated string of the tags.

### Example Request

```sh
curl -X POST "http://localhost:43180/tag/" -F "file=@path_to_your_image.jpg"

### Example Response
```json
    {
        "tags": [
            "tag1 (0.95)",
            "tag2 (0.85)"
        ],
        "tag_string": "tag1, tag2"
    }
