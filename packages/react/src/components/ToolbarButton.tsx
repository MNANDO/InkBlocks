import { JSX } from 'react';

type ToolbarButtonProps = {
	active?: boolean;
	spaced?: boolean;
	title: string;
	ariaLabel: string;
	onClick: () => void;
	children: JSX.Element;
};

export default function ToolbarButton({
	active,
	spaced,
	title,
	ariaLabel,
	onClick,
	children,
}: ToolbarButtonProps): JSX.Element {
	return (
		<button
			type="button"
			onClick={onClick}
			title={title}
			aria-label={ariaLabel}
			className={[
				'inline-flex items-center rounded-[10px] bg-transparent p-2 align-middle',
				spaced ? 'mr-0.5' : '',
				'cursor-pointer hover:bg-[#eee]',
				active ? 'bg-[rgba(223,232,250,0.3)]' : '',
			]
				.filter(Boolean)
				.join(' ')}
		>
			<span
				className={[
					'inline-flex h-4.5 w-4.5 items-center justify-center',
					active ? 'opacity-100' : 'opacity-60',
				].join(' ')}
			>
				{children}
			</span>
		</button>
	);
}
