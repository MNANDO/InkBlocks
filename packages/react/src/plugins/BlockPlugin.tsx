import type { JSX } from 'react';

import {
	INSERT_CHECK_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
	LexicalTypeaheadMenuPlugin,
	MenuOption,
	useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
	FORMAT_ELEMENT_COMMAND,
	LexicalEditor,
	TextNode,
} from 'lexical';
import { useCallback, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';

import useModal from '../hooks/useModal';

export class BlockPickerOption extends MenuOption {
	title: string;
	icon?: JSX.Element;
	keywords: Array<string>;
	keyboardShortcut?: string;
	onSelect: (queryString: string) => void;

	constructor(
		title: string,
		options: {
			icon?: JSX.Element;
			keywords?: Array<string>;
			keyboardShortcut?: string;
			onSelect: (queryString: string) => void;
		}
	) {
		super(title);
		this.title = title;
		this.keywords = options.keywords || [];
		this.icon = options.icon;
		this.keyboardShortcut = options.keyboardShortcut;
		this.onSelect = options.onSelect.bind(this);
	}
}

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
			{option.icon}
			<span className="flex min-w-[150px] flex-1 leading-5">
				{option.title}
			</span>
		</li>
	);
}

export type ShowModal = ReturnType<typeof useModal>[1];

export function getBaseOptions(editor: LexicalEditor, showModal: ShowModal) {
	return [
		new BlockPickerOption('Paragraph', {
			icon: <i className="icon paragraph" />,
			keywords: ['normal', 'paragraph', 'p', 'text'],
			onSelect: () =>
				editor.update(() => {
					const selection = $getSelection();
					if ($isRangeSelection(selection)) {
						$setBlocksType(selection, () => $createParagraphNode());
					}
				}),
		}),
		...([1, 2, 3] as const).map(
			(n) =>
				new BlockPickerOption(`Heading ${n}`, {
					icon: <i className={`icon h${n}`} />,
					keywords: ['heading', 'header', `h${n}`],
					onSelect: () =>
						editor.update(() => {
							const selection = $getSelection();
							if ($isRangeSelection(selection)) {
								$setBlocksType(selection, () =>
									$createHeadingNode(`h${n}`)
								);
							}
						}),
				})
		),
		new BlockPickerOption('Numbered List', {
			icon: <i className="icon number" />,
			keywords: ['numbered list', 'ordered list', 'ol'],
			onSelect: () =>
				editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
		}),
		new BlockPickerOption('Bulleted List', {
			icon: <i className="icon bullet" />,
			keywords: ['bulleted list', 'unordered list', 'ul'],
			onSelect: () =>
				editor.dispatchCommand(
					INSERT_UNORDERED_LIST_COMMAND,
					undefined
				),
		}),
		new BlockPickerOption('Check List', {
			icon: <i className="icon check" />,
			keywords: ['check list', 'todo list'],
			onSelect: () =>
				editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
		}),
		new BlockPickerOption('Quote', {
			icon: <i className="icon quote" />,
			keywords: ['block quote'],
			onSelect: () =>
				editor.update(() => {
					const selection = $getSelection();
					if ($isRangeSelection(selection)) {
						$setBlocksType(selection, () => $createQuoteNode());
					}
				}),
		}),
		new BlockPickerOption('Divider', {
			icon: <i className="icon horizontal-rule" />,
			keywords: ['horizontal rule', 'divider', 'hr'],
			onSelect: () =>
				editor.dispatchCommand(
					INSERT_HORIZONTAL_RULE_COMMAND,
					undefined
				),
		}),
		...(['left', 'center', 'right', 'justify'] as const).map(
			(alignment) =>
				new BlockPickerOption(`Align ${alignment}`, {
					icon: <i className={`icon ${alignment}-align`} />,
					keywords: ['align', 'justify', alignment],
					onSelect: () =>
						editor.dispatchCommand(
							FORMAT_ELEMENT_COMMAND,
							alignment
						),
				})
		),
	];
}

export default function BlockPickerPlugin(): JSX.Element {
	const [editor] = useLexicalComposerContext();
	const [modal, showModal] = useModal();
	const [queryString, setQueryString] = useState<string | null>(null);

	const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
		allowWhitespace: true,
		minLength: 0,
	});

	const options = useMemo(() => {
		const baseOptions = getBaseOptions(editor, showModal);

		if (!queryString) return baseOptions;

		const regex = new RegExp(queryString, 'i');

		return baseOptions.filter(
			(option) =>
				regex.test(option.title) ||
				option.keywords.some((keyword) => regex.test(keyword))
		);
	}, [editor, queryString, showModal]);

	const onSelectOption = useCallback(
		(
			selectedOption: BlockPickerOption,
			nodeToRemove: TextNode | null,
			closeMenu: () => void,
			matchingString: string
		) => {
			editor.update(() => {
				nodeToRemove?.remove();
				selectedOption.onSelect(matchingString);
				closeMenu();
			});
		},
		[editor]
	);

	return (
		<>
			{modal}
			<LexicalTypeaheadMenuPlugin<BlockPickerOption>
				onQueryChange={setQueryString}
				onSelectOption={onSelectOption}
				triggerFn={checkForTriggerMatch}
				options={options}
				menuRenderFn={(
					anchorElementRef,
					{
						selectedIndex,
						selectOptionAndCleanUp,
						setHighlightedIndex,
					}
				) =>
					anchorElementRef.current && options.length
						? ReactDOM.createPortal(
								<div className="relative w-50 rounded-lg bg-white shadow-[0px_5px_10px_rgba(0,0,0,0.3)]">
									<ul className="m-0 max-h-50 list-none overflow-y-auto rounded-lg p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
										{options.map((option, i: number) => (
											<BlockPickerMenuItem
												index={i}
												isSelected={selectedIndex === i}
												onClick={() => {
													setHighlightedIndex(i);
													selectOptionAndCleanUp(
														option
													);
												}}
												onMouseEnter={() => {
													setHighlightedIndex(i);
												}}
												key={option.key}
												option={option}
											/>
										))}
									</ul>
								</div>,
								anchorElementRef.current
						  )
						: null
				}
			/>
		</>
	);
}
