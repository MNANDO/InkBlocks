'use client';

import type { JSX } from 'react';

import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRef, useState, useCallback, useMemo } from 'react';
import * as ReactDOM from 'react-dom';
import { GripVertical, Plus } from 'lucide-react';
import { $createParagraphNode, $getNearestNodeFromDOMNode } from 'lexical';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';

import { ReactBlockDefinition } from '../types';
import { BlockPickerMenuItem } from '../components/BlockPickerMenuItem';
import { BlockPickerOption } from './BlockPickerOption';
import styles from './BlockPickerPlugin.module.css';

const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'ib-draggable-block-menu';

function isOnMenu(element: HTMLElement): boolean {
	return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

type DraggableBlockPluginProps = {
	anchorElem?: HTMLElement;
	blocks: ReactBlockDefinition[];
};

export default function DraggableBlockPlugin({
	anchorElem = document.body,
	blocks,
}: DraggableBlockPluginProps): JSX.Element {
	const [editor] = useLexicalComposerContext();
	const menuRef = useRef<HTMLDivElement>(null);
	const targetLineRef = useRef<HTMLDivElement>(null);
	const [showBlockPicker, setShowBlockPicker] = useState(false);
	const [blockPickerPosition, setBlockPickerPosition] = useState<{ top: number; left: number } | null>(null);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const draggableBlockElemRef = useRef<HTMLElement | null>(null);

	const options = useMemo(() => {
		return blocks.map((block) => new BlockPickerOption(block));
	}, [blocks]);

	const handleElementChanged = useCallback((element: HTMLElement | null) => {
		draggableBlockElemRef.current = element;
	}, []);

	const handlePlusClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

		const menuElement = menuRef.current;
		const draggableBlockElem = draggableBlockElemRef.current;
		if (!menuElement || !draggableBlockElem) return;

		// Insert a new paragraph after the current block and select it
		editor.update(() => {
			const node = $getNearestNodeFromDOMNode(draggableBlockElem);
			if (!node) return;

			// Create a new paragraph node
			const newParagraph = $createParagraphNode();

			// Insert after the current node
			if ($isDecoratorBlockNode(node)) {
				node.insertAfter(newParagraph);
			} else {
				node.insertAfter(newParagraph);
			}

			// Select the new paragraph
			newParagraph.select();
		});

		const rect = menuElement.getBoundingClientRect();
		setBlockPickerPosition({
			top: rect.top + rect.height,
			left: rect.right + 8,
		});
		setShowBlockPicker(true);
		setSelectedIndex(0);
	}, [editor]);

	const handleSelectOption = useCallback((option: BlockPickerOption) => {
		editor.update(() => {
			// The new paragraph is already selected, so just insert the block
			// which will replace/transform the current selection
			option.block.insert({
				editor,
				queryString: '',
			});
		});
		setShowBlockPicker(false);
	}, [editor]);

	const handleCloseBlockPicker = useCallback(() => {
		setShowBlockPicker(false);
	}, []);

	return (
		<>
			<DraggableBlockPlugin_EXPERIMENTAL
				anchorElem={anchorElem}
				menuRef={menuRef}
				targetLineRef={targetLineRef}
				onElementChanged={handleElementChanged}
				menuComponent={
					<div ref={menuRef} className={DRAGGABLE_BLOCK_MENU_CLASSNAME}>
						<button
							type="button"
							className="ib-draggable-block-button ib-draggable-block-plus"
							onClick={handlePlusClick}
							aria-label="Add block"
						>
							<Plus size={18} />
						</button>
						<div className="ib-draggable-block-icon">
							<GripVertical size={18} />
						</div>
					</div>
				}
				targetLineComponent={
					<div ref={targetLineRef} className="ib-draggable-block-target-line" />
				}
				isOnMenu={isOnMenu}
			/>
			{showBlockPicker && blockPickerPosition && ReactDOM.createPortal(
				<>
					<div
						className="ib-block-picker-overlay"
						onClick={handleCloseBlockPicker}
					/>
					<div
						className={styles.menu}
						style={{
							position: 'fixed',
							top: blockPickerPosition.top,
							left: blockPickerPosition.left,
							zIndex: 1000,
						}}
					>
						<ul className={styles.list}>
							{options.map((option, i) => (
								<BlockPickerMenuItem
									key={option.key}
									index={i}
									isSelected={selectedIndex === i}
									onClick={() => handleSelectOption(option)}
									onMouseEnter={() => setSelectedIndex(i)}
									option={option}
								/>
							))}
						</ul>
					</div>
				</>,
				document.body
			)}
		</>
	);
}
