import type { FunctionComponent, ReactNode } from 'react';

type ButtonThemes = 'primary' | 'secondary' | 'success';

interface ButtonProps {
	children: ReactNode;
	theme?: ButtonThemes;
}

const classMapper: Record<ButtonThemes, string> = {
	primary: 'bg-indigo-400 text-white',
	secondary: '',
	success: 'bg-green-400',
};

const Button: FunctionComponent<ButtonProps> = ({ children, theme = 'primary' }: ButtonProps) => {
	return (
		<button
			className={'border-1 border-gray-500 rounded-xl text-white text-xl px-4 py-2 ' + classMapper[theme]}
		>
			{children}
		</button>
	);
};

export default Button;
