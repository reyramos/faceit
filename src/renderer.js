const fs = require('fs');
const path = require('path');
const cv = require('opencv4nodejs');
const fr = require('face-recognition').withCv(cv);
// const detector = fr.FaceDetector();
// const recognizer = fr.FaceRecognizer();
const appdataPath = path.resolve(__dirname, '../data/appdata');
const imagesPath = path.resolve(__dirname, '../data/capture');

const {
	drawBlueRect,
	ensureDirectoryExists
} = require('./utils');


ensureDirectoryExists(appdataPath);
ensureDirectoryExists(imagesPath);
//
// const trainedModelFile = 'faceRecognitionModel.json';
// const trainedModelFilePath = path.resolve(appdataPath, trainedModelFile);

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);


function detectFaces(img) {
	// restrict minSize and scaleFactor for faster processing
	const options = {
		minSize: new cv.Size(100, 100),
		scaleFactor: 1.2,
		minNeighbors: 10
	};

	return classifier.detectMultiScaleGpu(img.bgrToGray(), options).objects;
}

// Put event listeners into place
window.addEventListener('DOMContentLoaded', function () {
	// Grab elements, create settings, etc.
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	const image = new Image();
	image.onload = () => ctx.drawImage(image, 0, 0);
	const cap = new cv.VideoCapture(0);

	setInterval(() => {
		let frame = cap.read();
		// loop back to start on end of stream reached
		if (frame.empty) {
			cap.reset();
			frame = cap.read();
		}

		const frameResized = frame.resizeToMax(640);

		//set the size of the canvas
		const height = frameResized.sizes[ 0 ];
		const width = frameResized.sizes[ 1 ];
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';

		// detect faces
		const faceRects = detectFaces(frameResized);

		if (faceRects.length) {
			// draw detection
			faceRects.forEach(faceRect => drawBlueRect(frameResized, faceRect));
		}

		//load the image in the canvas to display the capture
		const outBase64 = cv.imencode('.jpg', frameResized).toString('base64'); // Perform base64 encoding
		const base64String = 'data:image/jpeg;base64,' + outBase64;

		let base64Image = base64String.split(';base64,').pop();

		image.src = base64Image;

		// if (capture < numTrainingFaces)
		// 	fs.writeFile(path.resolve(_imagesPath, 'capture_' + capture + '.jpeg'), base64Image, {encoding: 'base64'}, function (err) {
		// 		if (err) console.log(err);
		// 	});


	}, 0);


}, false);