import type { JSX } from 'react';
import styles from './ToolbarButton.module.css';

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
				styles.button,
				spaced ? styles.spaced : '',
				active ? styles.active : '',
			]
				.filter(Boolean)
				.join(' ')}
		>
			<span
				className={[
					styles.iconWrap,
					active ? styles.iconActive : styles.iconInactive,
				]
					.filter(Boolean)
					.join(' ')}
			>
				{children}
			</span>
		</button>
	);
}
