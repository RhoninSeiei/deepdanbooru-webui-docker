document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const uploadButton = document.getElementById('uploadButton');
    const dropZone = document.getElementById('drop-zone');
    const exampleImage = document.getElementById('example-image');
    const results = document.getElementById('results');
    const tagString = document.getElementById('tagString');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    let uploadedImageFile = null;

    function handleFiles(files) {
        const file = files[0];
        if (!file) {
            alert('Please select an image first.');
            return;
        }

        uploadedImageFile = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            exampleImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    imageInput.addEventListener('change', () => {
        handleFiles(imageInput.files);
    });

    dropZone.addEventListener('click', () => {
        imageInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    document.addEventListener('paste', (e) => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                handleFiles([file]);
                break;
            }
        }
    });

    uploadButton.addEventListener('click', async () => {
        if (!uploadedImageFile) {
            // 使用示例图片
            const response = await fetch(exampleImage.src);
            const blob = await response.blob();
            uploadedImageFile = new File([blob], "example.png", { type: "image/png" });
        }

        const formData = new FormData();
        formData.append('file', uploadedImageFile);

        loading.style.display = 'block';
        results.innerHTML = '';
        tagString.innerHTML = '';
        error.textContent = '';

        try {
            const response = await fetch('/tag/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            results.innerHTML = data.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            tagString.innerHTML = `<p>Tag String: ${data.tag_string}</p>`;
        } catch (error) {
            console.error('Error:', error);
            error.textContent = 'An error occurred while processing the image.';
        } finally {
            loading.style.display = 'none';
        }
    });

    // 默认将示例图片作为上传图片
    (async () => {
        const response = await fetch(exampleImage.src);
        const blob = await response.blob();
        uploadedImageFile = new File([blob], "example.png", { type: "image/png" });
    })();
});
