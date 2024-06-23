document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const uploadButton = document.getElementById('uploadButton');
    const imagePreview = document.getElementById('imagePreview');
    const results = document.getElementById('results');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    uploadButton.addEventListener('click', async () => {
        const file = imageInput.files[0];
        if (!file) {
            alert('Please select an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        // 显示加载信息并清除之前的结果和错误
        loading.style.display = 'block';
        results.innerHTML = '';
        error.textContent = '';
        imagePreview.innerHTML = '';

        try {
            const response = await fetch('/deepdanbooru', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // 显示图像预览
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded image">`;
            };
            reader.readAsDataURL(file);

            // 显示结果
            results.innerHTML = data.map(item => `<span class="tag">${item.tag} (${item.score.toFixed(2)})</span>`).join('');
        } catch (error) {
            console.error('Error:', error);
            error.textContent = 'An error occurred while processing the image.';
        } finally {
            // 隐藏加载信息
            loading.style.display = 'none';
        }
    });
});
