let model;
let uploadedImage = null;

// Load the Coco-SSD model
async function loadModel() {
    model = await cocoSsd.load();
    console.log("Model Loaded!");
}

// Call this function when the file is uploaded
async function handleFileUpload(event) {
    const file = event.target.files[0];

    if (file) {
        const fileType = file.type;

        // If the uploaded file is an image
        if (fileType.startsWith('image')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imagePreview = document.getElementById('image-preview');
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                uploadedImage = imagePreview;
            };
            reader.readAsDataURL(file);
        }
    }
}
function showImageSelectionDialog() {
    if (uploadedImage) {
        recognizeImageContent(uploadedImage);
    } else {
        alert("Please upload an image first.");
    }
}
async function recognizeImageContent(image) {
    if (!model) {
        await loadModel(); // Ensure model is loaded first
    }

    const predictions = await model.detect(image);

    const predictionResult = document.getElementById('prediction-result');
    if (predictions.length > 0) {
        predictionResult.innerHTML = "Predicted objects: " + predictions.map(p => p.class).join(", ");
    } else {
        predictionResult.innerHTML = "No objects detected in the image.";
    }
}

// Load model as soon as the page is ready
loadModel();
