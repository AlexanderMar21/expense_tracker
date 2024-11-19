'use client';

import { createRef, useEffect, useState, type FunctionComponent } from 'react';
import Button from './Button/Button';
import { createWorker, type ImageLike, type Word } from 'tesseract.js';

interface CameraFrameProps {
	onCloseClick?: () => void;
}

const CameraFrame: FunctionComponent<CameraFrameProps> = ({ onCloseClick }) => {
	const width = 320; // We will scale the photo width to this
	const height = 200;
	const videoRef = createRef<HTMLVideoElement>();
	const canvasRef = createRef<HTMLCanvasElement>();
	const photoRef = createRef<HTMLImageElement>();
	const [recognizeText, setRecognizeText] = useState<Word[]>();
	const facingMode = 'environment';
	var constraints = {
		audio: false,
		video: {
			facingMode: facingMode,
		},
	};

	const initializeStream = () => {
		navigator?.mediaDevices?.getUserMedia(constraints).then(function success(stream) {
			if (!videoRef.current) {
				return;
			}
			videoRef.current.srcObject = stream;
			videoRef.current.play();
			canvasRef.current?.setAttribute('height', `${videoRef.current.height}px`);
			canvasRef.current?.setAttribute('width', `${videoRef.current.width}px`);
		});
	};

	const recognize = async (image: ImageLike) => {
		const worker = await createWorker('eng');
		const ret = await worker.recognize(image);
		await worker.terminate();
		return ret.data.words;
	};

	async function takePicture() {
		const context = canvasRef.current?.getContext('2d');
		if (videoRef.current && canvasRef.current) {
			canvasRef.current.width = width;
			canvasRef.current.height = height;
			context?.drawImage(videoRef.current, 0, 0, canvasRef.current?.width, canvasRef.current?.height);

			const data = canvasRef.current?.toDataURL('image/png');
			const res = await recognize(data);
			setRecognizeText(res);
			photoRef.current?.setAttribute('src', data);
		} else {
			clearPhoto();
		}
	}

	function clearPhoto() {
		const context = canvasRef.current?.getContext('2d');
		if (!context || !canvasRef.current) return;
		context.fillStyle = '#AAA';
		context.fillRect(0, 0, canvasRef.current?.width, canvasRef.current?.height);

		const data = canvasRef.current?.toDataURL('image/png');

		photoRef.current?.setAttribute('src', data);
	}

	const stopStream = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream;
			const tracks = stream.getTracks();

			// Stop all tracks
			tracks.forEach((track) => track.stop());

			// Remove the stream from the video element
			videoRef.current.srcObject = null;
		}
	};

	const onCloseBtnClick = () => {
		stopStream();
		onCloseClick?.();
	};

	useEffect(() => {
		initializeStream();
	}, []);

	return (
		<div className="bg-gray-700/50 backdrop-blur fixed inset-0 z-10 flex items-center flex-col gap-6 justify-center">
			<button onClick={onCloseBtnClick}>X</button>
			<video
				style={{ height: `${height}px`, width: `${width}px` }}
				playsInline
				muted
				className="min-w-[340px] min-h-[200px] rounded-xl"
				ref={videoRef}
			/>
			<canvas id="canvas" className="hidden" ref={canvasRef}></canvas>
			<div>
				{recognizeText?.map((word, index) => (
					<span key={word.text + index}>{word.text}</span>
				))}
			</div>
			<Button onClick={takePicture}>Take Photo</Button>
		</div>
	);
};

export default CameraFrame;
