'use client';

import { useRef, useState, type FunctionComponent } from 'react';
import { createWorker, type ImageLike } from 'tesseract.js';

interface CameraFrameProps {
	onCloseClick?: () => void;
}

const CameraFrame: FunctionComponent<CameraFrameProps> = ({ onCloseClick }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [imageWords, setImageWords] = useState<string[]>();

	const recognizer = async (image?: ImageLike) => {
		if (!image) return;
		const worker = await createWorker('eng');
		const ret = await worker.recognize(image);
		const words = ret.data.words.flatMap((word) => word.text).filter((item) => /^[\d,]+(\.\d+)?$/.test(item));
		setImageWords(words);
		await worker.terminate();
	};

	async function loadImageFromFile() {
		console.log('Loading image');
		let files = fileInputRef.current?.files;
		if (files?.length == 0) {
			return;
		}
		let file = files?.[0];
		if (!file) return;
		const fileReader = new FileReader();
		fileReader.onload = async function (e) {
			console.log('Loading image success');
			await recognizer(e.target?.result as ImageLike);
			// document.getElementById("photoTaken").src = e.target?.result;
		};
		fileReader.onerror = function () {
			console.warn('oops, something went wrong.');
		};
		fileReader.readAsDataURL(file);
	}

	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
			tracks.forEach((track) => track.stop());
		}
	};

	return (
		<div className="bg-gray-700/50 backdrop-blur fixed inset-0 z-10 flex items-center flex-col gap-6 justify-center">
			<label>
				Take Photo
				<input
					ref={fileInputRef}
					onChange={loadImageFromFile}
					type="file"
					name="image"
					accept="image/*"
					capture
					className="hidden"
				/>
			</label>
			<div className="flex items-center justify-center flex-wrap gap-4">
				{imageWords?.map((word, index) => (
					<span className="inline-block py-1 px-2 rounded-full bg-indigo-800 text-white" key={word + index}>
						{word}
					</span>
				))}
			</div>
		</div>
	);
};

export default CameraFrame;
