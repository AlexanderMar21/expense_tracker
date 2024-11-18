import {
	type FunctionComponent,
	type ReactNode,
	type HTMLAttributes,
	type ButtonHTMLAttributes,
} from 'react';

type ButtonThemes = 'primary' | 'secondary' | 'success';

type ButtonProps = {
	children: ReactNode;
	events?: ButtonHTMLAttributes<HTMLButtonElement>;
	theme?: ButtonThemes;
} & HTMLAttributes<HTMLButtonElement>;

const classMapper: Record<ButtonThemes, string> = {
	primary: 'bg-indigo-400 text-white dark:bg-indigo-800',
	secondary: '',
	success: 'bg-green-400',
};

const Button: FunctionComponent<ButtonProps> = ({
	children,
	className,
	onClick,
	theme = 'primary',
}: ButtonProps) => {
	return (
		<button
			className={
				'border-1 border-gray-500 rounded-xl text-white text-xl px-4 py-2 ' +
				classMapper[theme] +
				` ${className}`
			}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default Button;
