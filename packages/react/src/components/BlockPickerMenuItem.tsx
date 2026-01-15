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
	const className = isSelected
		? 'mx-2 flex cursor-pointer flex-row items-center gap-2 rounded-lg bg-zinc-100 px-2 py-2 text-[15px] leading-4 text-zinc-950 outline-none'
		: 'mx-2 flex cursor-pointer flex-row items-center gap-2 rounded-lg bg-white px-2 py-2 text-[15px] leading-4 text-zinc-950 outline-none hover:bg-zinc-100';

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
			<span className="flex h-4 w-4 items-center justify-center [&>svg]:h-5 [&>svg]:w-4">
				{option.block.icon}
			</span>
			<span className="flex min-w-37.5 flex-1 leading-5">
				{option.block.title}
			</span>
		</li>
	);
}
