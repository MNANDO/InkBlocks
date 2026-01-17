import type { JSX } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
	LexicalTypeaheadMenuPlugin,
	useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode } from 'lexical';
import { useCallback, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';

import useModal from '../hooks/useModal';
import ModalHost from '../components/ModalHost';
import { BlockPickerOption } from './BlockPickerOption';
import { BlockPickerMenuItem } from '../components/BlockPickerMenuItem';
import { BlockDefinition } from '../blocks/types';
import styles from './BlockPickerPlugin.module.css';

export type ShowModal = ReturnType<typeof useModal>['showModal'];

export function getBaseOptions(blocks: BlockDefinition[]): BlockPickerOption[] {
	return blocks.map((block) => new BlockPickerOption(block));
}

type BlockPickerPluginProps = {
	blocks: BlockDefinition[];
};

export default function BlockPickerPlugin({
	blocks,
}: BlockPickerPluginProps): JSX.Element {
	const [editor] = useLexicalComposerContext();

	const { modalState, showModal, closeModal } = useModal();

	const [queryString, setQueryString] = useState<string | null>(null);

	const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
		allowWhitespace: true,
		minLength: 0,
	});

	const options = useMemo(() => {
		const baseOptions = getBaseOptions(blocks);

		if (!queryString) return baseOptions;

		const regex = new RegExp(queryString, 'i');

		return baseOptions.filter((option) => {
			const { title, keywords } = option.block;
			return (
				regex.test(title) ||
				keywords.some((keyword) => regex.test(keyword))
			);
		});
	}, [blocks, queryString]);

	const onSelectOption = useCallback(
		(
			selectedOption: BlockPickerOption,
			nodeToRemove: TextNode | null,
			closeMenu: () => void,
			matchingString: string
		) => {
			editor.update(() => {
				nodeToRemove?.remove();
				selectedOption.block.insert({
					editor,
					queryString: matchingString,
				});
				closeMenu();
			});
		},
		[editor]
	);

	return (
		<>
			<ModalHost modalState={modalState} onClose={closeModal} />

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
								<div className={styles.menu}>
									<ul className={styles.list}>
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
