'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SlideUpDialogProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
}

export const SlideUpDialog: React.FC<SlideUpDialogProps> = ({ isOpen, onClose, children, title }) => {
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, onClose]);

	const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
			onClose();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={handleOutsideClick}
				>
					<motion.div
						ref={dialogRef}
						className="bg-white rounded-t-xl w-full max-w-lg p-6 relative"
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						exit={{ y: '100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 500 }}
					>
						<button
							onClick={onClose}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
							aria-label="Close dialog"
						>
							<X size={24} />
						</button>
						{title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
