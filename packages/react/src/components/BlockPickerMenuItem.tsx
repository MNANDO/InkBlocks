import styles from './BlockPickerMenuItem.module.css';
import { BlockPickerOption } from '../plugins/BlockPickerOption';

export function BlockPickerMenuItem({
	index,
	isSelected,
	onClick,
	onMouseEnter,
	option,
}: {
	index: number;
	isSelected: boolean;
	onClick: () => void;
	onMouseEnter: () => void;
	option: BlockPickerOption;
}) {
	const className = isSelected ? styles.itemSelected : styles.item;

	return (
		<li
			key={option.key}
			tabIndex={-1}
			className={className}
			ref={option.setRefElement}
			role="option"
			aria-selected={isSelected}
			id={'typeahead-item-' + index}
			onMouseEnter={onMouseEnter}
			onClick={onClick}
		>
			<span className={styles.icon}>{option.block.icon}</span>
			<span className={styles.title}>{option.block.title}</span>
		</li>
	);
}
