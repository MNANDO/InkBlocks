import { ReactNode } from 'react';
import styles from './BlockPickerMenuItem.module.css';

export function BlockPickerMenuItem({
	index,
	isSelected,
	onClick,
	onMouseEnter,
	setRefElement,
	icon,
	title,
}: {
	index: number;
	isSelected: boolean;
	onClick: () => void;
	onMouseEnter: () => void;
	setRefElement: (element: HTMLElement | null) => void;
	icon: ReactNode;
	title: string;
}) {
	const className = isSelected ? styles.itemSelected : styles.item;

	return (
		<li
			tabIndex={-1}
			className={className}
			ref={setRefElement}
			role="option"
			aria-selected={isSelected}
			id={'typeahead-item-' + index}
			onMouseEnter={onMouseEnter}
			onClick={onClick}
		>
			<span className={styles.icon}>{icon}</span>
			<span className={styles.title}>{title}</span>
		</li>
	);
}
