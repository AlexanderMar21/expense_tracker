'use client';

import { useCallback, useEffect, useRef, useState, type FunctionComponent } from 'react';
import Button from './Button/Button';
import { createWorker, type ImageLike, type Word } from 'tesseract.js';

interface CameraFrameProps {
	onCloseClick?: () => void;
}

const CameraFrame: FunctionComponent<CameraFrameProps> = ({ onCloseClick }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [imageWords, setImageWords] = useState<string[]>();

	const [image, setImage] = useState<string | null>(null);

	const facingMode = 'environment';
	var constraints = {
		audio: false,
		video: {
			facingMode: facingMode,
			width: { min: 640, ideal: 320 },
			height: { min: 360, ideal: 180 },
		},
	};

	const startCamera = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (err) {
			console.error('Error accessing the camera', err);
		}
	}, []);

	const recognizer = async (image: ImageLike) => {
		const worker = await createWorker('eng');
		const ret = await worker.recognize(image);
		const words = ret.data.words.flatMap((word) => word.text);
		setImageWords(words);
		await worker.terminate();
	};

	const capturePhoto = useCallback(async () => {
		if (videoRef.current && canvasRef.current) {
			const context = canvasRef.current.getContext('2d');
			if (context) {
				// Get the video dimensions
				const videoWidth = videoRef.current.videoWidth;
				const videoHeight = videoRef.current.videoHeight;

				// Calculate the dimensions and position of the frame to capture
				const frameSizeX = 160;
				const frameSizeY = 60;
				const startX = (videoWidth - frameSizeX) / 2;
				const startY = (videoHeight - frameSizeY) / 2;

				// Set canvas size to match the frame size
				canvasRef.current.width = frameSizeX;
				canvasRef.current.height = frameSizeY;

				// Draw the selected portion of the video onto the canvas
				context.drawImage(
					videoRef.current,
					startX,
					startY,
					frameSizeX,
					frameSizeY, // Source rectangle
					0,
					0,
					frameSizeX,
					frameSizeY // Destination rectangle
				);

				const imageDataUrl = canvasRef.current.toDataURL('image/png');
				setImage(imageDataUrl);
				await recognizer(imageDataUrl);
			}
		}
		stopCamera();
	}, []);

	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
			tracks.forEach((track) => track.stop());
		}
	};

	const resetCapture = useCallback(async () => {
		setImage(null);
		setImageWords([]);
		if (videoRef.current && videoRef.current.srcObject) {
			await startCamera();
		}
	}, []);

	const onCloseBtnClick = () => {
		stopCamera();
		onCloseClick?.();
	};

	useEffect(() => {
		startCamera();

		return stopCamera;
	});

	return (
		<div className="bg-gray-700/50 backdrop-blur fixed inset-0 z-10 flex items-center flex-col gap-6 justify-center">
			<button onClick={onCloseBtnClick}>X</button>
			{!image ? (
				<div className="relative w-[320px] aspect-video bg-gray-200 rounded-lg overflow-hidden">
					<video
						ref={videoRef}
						autoPlay
						playsInline
						className="absolute inset-0 w-full h-full object-cover rounded-xl"
						aria-label="Camera feed"
					/>
					<div className="absolute border-solid border-2 border-indigo-600 h-1/3 w-1/2 transform translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]"></div>
				</div>
			) : (
				<div className="relative  w-[320px] aspect-video bg-gray-200 rounded-lg overflow-hidden">
					<img
						src={image}
						alt="Captured photo"
						className="absolute inset-0 w-full h-full object-cover rounded-xl"
					/>
				</div>
			)}
			<canvas ref={canvasRef} className="hidden" width="640" height="480" />
			<div className="flex items-center justify-center flex-wrap gap-4">
				{imageWords?.map((word, index) => (
					<span className="inline-block py-1 px-2 rounded-full bg-indigo-800 text-white" key={word + index}>
						{word}
					</span>
				))}
			</div>
			<div className="flex items-center justify-stretch gap-4">
				<Button theme="success" onClick={capturePhoto}>
					Take Photo
				</Button>
				<Button theme="secondary" onClick={resetCapture}>
					Retake
				</Button>
			</div>
		</div>
	);
};

export default CameraFrame;
