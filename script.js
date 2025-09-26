const startButton = document.getElementById('startButton');
const captureButton = document.getElementById('captureButton');
const downloadButton = document.getElementById('downloadButton');
const restartButton = document.getElementById('restartButton');
const video = document.getElementById('videoElement');

let photoCount = 0;
let photoArray = [];

startButton.addEventListener('click', function() {
    document.getElementById('welcomeScreen').classList.remove('active');
    document.getElementById('cameraScreen').classList.add('active');
    startCamera();
});

captureButton.addEventListener('click', function() {
    takePhoto();
});

downloadButton.addEventListener('click', function() {
    downloadPhotoStrip();
});

restartButton.addEventListener('click', function() {
    restartBooth();
});

function startCamera() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
            })
            .catch(function(error) {
                alert("Camera error: " + error);
            });
    }
}

function takePhoto() {
    const canvas = document.getElementById('canvasElement');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const photoData = canvas.toDataURL('image/png');
    photoArray.push(photoData);
    photoCount++;
    
    updateDisplay();
    
    if (photoCount >= 3) {
        showResults();
    }
}

function updateDisplay() {
    document.getElementById('photoNumber').textContent = photoCount;
    document.getElementById('currentPhoto').textContent = photoCount + 1;
    
    const previewContainer = document.getElementById('previewContainer');
    const img = document.createElement('img');
    img.src = photoArray[photoArray.length - 1];
    img.className = 'preview-image';
    previewContainer.appendChild(img);
}

function showResults() {
    document.getElementById('cameraScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.add('active');
    
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<div class="photo-strip"></div>';
    const photoStrip = resultsContainer.querySelector('.photo-strip');
    
    photoArray.forEach((photo) => {
        const img = document.createElement('img');
        img.src = photo;
        photoStrip.appendChild(img);
    });
}

function downloadPhotoStrip() {
    const finalCanvas = document.createElement('canvas');
    const finalContext = finalCanvas.getContext('2d');
    
    finalCanvas.width = 400;
    finalCanvas.height = 900;
    
    finalContext.fillStyle = 'white';
    finalContext.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    
    let yPosition = 0;
    const photoHeight = 280;
    
    photoArray.forEach((photoData) => {
        const img = new Image();
        img.src = photoData;
        
        img.onload = function() {
            finalContext.drawImage(img, 50, yPosition, 300, photoHeight);
            yPosition += photoHeight + 20;
            
            if (yPosition >= photoHeight * 3) {
                const imageData = finalCanvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = imageData;
                downloadLink.download = 'my-photobooth-strip.png';
                downloadLink.click();
            }
        };
    });
}

function restartBooth() {
    photoCount = 0;
    photoArray = [];
    document.getElementById('previewContainer').innerHTML = '';
    document.getElementById('photoNumber').textContent = '1';
    document.getElementById('currentPhoto').textContent = '1';
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('cameraScreen').classList.add('active');
}