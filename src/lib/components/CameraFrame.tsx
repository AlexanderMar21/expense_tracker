'use client';

import { useCallback, useEffect, useRef, useState, type FunctionComponent } from 'react';
import Button from './Button/Button';
import { createWorker, type ImageLike } from 'tesseract.js';

interface CameraFrameProps {
	onCloseClick?: () => void;
}

const CameraFrame: FunctionComponent<CameraFrameProps> = ({ onCloseClick }) => {
	const [streaming, setStreaming] = useState(false);
	const [imageWords, setImageWords] = useState<string[]>();

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const width = 320;
	const height = 240;

	const facingMode = 'environment';
	var constraints = {
		audio: false,
		video: {
			facingMode: facingMode,
		},
	};

	const recognizer = async (image: ImageLike) => {
		const worker = await createWorker('eng');
		const ret = await worker.recognize(image);
		const words = ret.data.words.flatMap((word) => word.text).filter((item) => /^[\d,]+(\.\d+)?$/.test(item));
		setImageWords(words);
		await worker.terminate();
	};

	const startCamera = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.play();
			}
		} catch (err) {
			console.error(`An error occurred: ${err}`);
		}
	}, []);

	const clearPhoto = useCallback(() => {
		const context = canvasRef.current?.getContext('2d');
		if (context) {
			context.fillStyle = '#AAA';
			context.fillRect(0, 0, width, height);
		}
	}, []);

	const takePicture = useCallback(async () => {
		const context = canvasRef.current?.getContext('2d');
		if (context && videoRef.current && canvasRef.current) {
			context.drawImage(videoRef.current, 0, 0, width, height);

			const data = canvasRef.current?.toDataURL('image/png');
			await recognizer(data);
		}
		clearPhoto();
	}, []);

	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
			tracks.forEach((track) => track.stop());
		}
	};

	useEffect(() => {
		startCamera();
		const handleCanPlay = () => {
			if (!streaming) {
				setStreaming(true);
			}
		};

		const videoElement = videoRef.current;
		videoElement?.addEventListener('canplay', handleCanPlay);

		return () => {
			videoElement?.removeEventListener('canplay', handleCanPlay);
			stopCamera();
		};
	}, []);

	const onCloseBtnClick = () => {
		stopCamera();
		onCloseClick?.();
	};

	return (
		<div className="bg-gray-700/50 backdrop-blur fixed inset-0 z-10 flex items-center flex-col gap-6 justify-center px-4">
			<div>
				<video
					ref={videoRef}
					style={{ width: '100%', height: 'auto', backgroundColor: '#ddd', borderRadius: '4px' }}
					width={width}
					height={height}
				>
					Your browser does not support the video tag.
				</video>
			</div>
			<canvas ref={canvasRef} style={{ display: 'none' }} width={width} height={height} />
			<div className="flex items-center justify-center flex-wrap gap-4">
				{imageWords?.map((word, index) => (
					<span className="inline-flex py-1 px-3 rounded-full bg-indigo-800 text-white" key={word + index}>
						{word}
					</span>
				))}
			</div>
			<div className="flex flex-col items-center gap-3">
				<Button onClick={takePicture} theme="success">
					Scan for numbers
				</Button>
				<Button onClick={onCloseBtnClick} theme="secondary">
					Close
				</Button>
			</div>
		</div>
	);
};

export default CameraFrame;
