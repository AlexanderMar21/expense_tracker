import React from 'react';
import type { IconType } from 'react-icons';
import { FaPlus, FaChartSimple } from 'react-icons/fa6';
import { GrMoney } from 'react-icons/gr';

type BottomLinkProps = {
	label: string;
	Icon: IconType;
};
const BottomLink = ({ label, Icon }: BottomLinkProps) => {
	return (
		<>
			<li className="flex items-center justify-center gap-px flex-col">
				<Icon size={20} />
				<p>{label}</p>
			</li>
		</>
	);
};

function BottomNavigation() {
	return (
		<nav className="fixed bottom-0 left-0 w-full">
			<ul className="max-layout rounded-t-lg p-3 sm:p-4 bg-gray-800 flex items-center justify-evenly">
				<BottomLink label="Records" Icon={GrMoney} />
				<li>
					<button className="bg-purple-800 p-2 rounded-full">
						<FaPlus size={26} className="fill-white" />
					</button>
				</li>
				<BottomLink label="Charts" Icon={FaChartSimple} />
			</ul>
		</nav>
	);
}

export default BottomNavigation;
