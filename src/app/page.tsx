'use client';

import Button from '@/lib/components/Button/Button';
import CameraFrame from '@/lib/components/CameraFrame';
import { useState } from 'react';

export default function Home() {
	const [isCameraOpen, setIsCameraOpen] = useState(false);

	const openCamera = () => {
		setIsCameraOpen(true);
	};

	const closeCamera = () => {
		setIsCameraOpen(false);
	};

	return (
		<div className="flex flex-col min-h-screen items-center justify-center">
			<Button className="tat" onClick={openCamera}>
				Open Camera
			</Button>
			{isCameraOpen && <CameraFrame onCloseClick={closeCamera} />}
		</div>
	);
}
