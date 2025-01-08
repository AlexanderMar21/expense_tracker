import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import BottomNavigation from '@/lib/components/BottomNavigation';
import SummaryHeader from '@/lib/components/SummaryHeader';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'Expense Tracker',
	description: 'Developed by Alexanter Margkioni',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900 dark:text-[#fefefe]`}
			>
				<div className="max-layout bg-white dark:bg-gray-900 relative">
					<SummaryHeader />
					<main>{children}</main>
					<BottomNavigation />
				</div>
			</body>
		</html>
	);
}
