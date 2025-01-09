'use client';

import { RecordForm } from '@/lib/components/RecordForm';

export default function Home() {
	const categories = [{ id: 'q', name: 'T' }];
	return (
		<div className="flex flex-col min-h-screen items-center justify-center">
			<RecordForm categories={categories} />
		</div>
	);
}
