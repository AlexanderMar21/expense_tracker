'use client';

import { createRef, useEffect, type FunctionComponent } from 'react';
import Button from './Button/Button';

interface CameraFrameProps {
	onCloseClick?: () => void;
}

const CameraFrame: FunctionComponent<CameraFrameProps> = ({ onCloseClick }) => {
	const videoRef = createRef<HTMLVideoElement>();
	const facingMode = 'environment';
	var constraints = {
		audio: false,
		video: {
			facingMode: facingMode,
		},
	};

	const initializeStream = () => {
		navigator?.mediaDevices.getUserMedia(constraints).then(function success(stream) {
			if (!videoRef.current) {
				return;
			}
			videoRef.current.srcObject = stream;
			videoRef.current.play();
		});
	};

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
			<video playsInline muted className="min-w-[340px] min-h-[200px] rounded-xl" ref={videoRef} />
			<Button>Take Photo</Button>
		</div>
	);
};

export default CameraFrame;
