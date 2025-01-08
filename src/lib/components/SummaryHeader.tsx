import React from 'react';

type SummaryHeaderItemProps = {
	title: string;
	value: string | JSX.Element;
};
const SummaryHeaderItem = ({ title, value }: SummaryHeaderItemProps) => (
	<div className="flex flex-col items-start">
		<small className="text-gray-200">{title}</small>
		<p className="">{value}</p>
	</div>
);
function SummaryHeader() {
	return (
		<header className="">
			<div className="max-layout rounded-b-lg p-3 sm:px-6 sm:py-4 bg-gray-800 flex items-center justify-between">
				<SummaryHeaderItem title="2025" value="Jan" />
				<SummaryHeaderItem title="Income" value="394" />
				<SummaryHeaderItem title="Expenses" value="778" />
				<SummaryHeaderItem title="Balance" value="-999" />
			</div>
		</header>
	);
}

export default SummaryHeader;
