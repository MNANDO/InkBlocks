import { mergeRegister } from '@lexical/utils';
import {
	$getSelection,
	COMMAND_PRIORITY_LOW,
	FORMAT_TEXT_COMMAND,
	getDOMSelection,
	LexicalEditor,
	SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { JSX, useCallback, useEffect, useRef } from 'react';

import { Bold, Italic, Underline, Strikethrough } from 'lucide-react';

import { getDOMRangeRect, setFloatingElemPosition } from '../utils';
import ToolbarButton from './ToolbarButton';
import styles from './FloatingToolbar.module.css';

export default function FloatingToolbar({
	editor,
	anchorElem,
	isBold,
	isItalic,
	isUnderline,
	isStrikethrough,
}: {
	editor: LexicalEditor;
	anchorElem: HTMLElement;
	isBold: boolean;
	isItalic: boolean;
	isUnderline: boolean;
	isUppercase: boolean;
	isLowercase: boolean;
	isCapitalize: boolean;
	isStrikethrough: boolean;
	isSubscript: boolean;
	isSuperscript: boolean;
}): JSX.Element {
	const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

	function mouseMoveListener(e: MouseEvent) {
		if (
			popupCharStylesEditorRef.current &&
			(e.buttons === 1 || e.buttons === 3)
		) {
			if (
				popupCharStylesEditorRef.current.style.pointerEvents !== 'none'
			) {
				const elementUnderMouse = document.elementFromPoint(
					e.clientX,
					e.clientY,
				);
				if (
					elementUnderMouse &&
					!popupCharStylesEditorRef.current.contains(
						elementUnderMouse,
					)
				) {
					popupCharStylesEditorRef.current.style.pointerEvents =
						'none';
				}
			}
		}
	}

	function mouseUpListener() {
		if (!popupCharStylesEditorRef.current) return;
		if (popupCharStylesEditorRef.current.style.pointerEvents !== 'auto') {
			popupCharStylesEditorRef.current.style.pointerEvents = 'auto';
		}
	}

	useEffect(() => {
		if (!popupCharStylesEditorRef.current) return;

		document.addEventListener('mousemove', mouseMoveListener);
		document.addEventListener('mouseup', mouseUpListener);

		return () => {
			document.removeEventListener('mousemove', mouseMoveListener);
			document.removeEventListener('mouseup', mouseUpListener);
		};
	}, []);

	const $updateTextFormatFloatingToolbar = useCallback(() => {
		const selection = $getSelection();
		const popupElem = popupCharStylesEditorRef.current;
		const nativeSelection = getDOMSelection(editor._window);

		if (popupElem === null) return;

		const rootElement = editor.getRootElement();
		if (
			selection !== null &&
			nativeSelection !== null &&
			!nativeSelection.isCollapsed &&
			rootElement !== null &&
			rootElement.contains(nativeSelection.anchorNode)
		) {
			const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
			setFloatingElemPosition(rangeRect, popupElem, anchorElem, false);
		}
	}, [editor, anchorElem]);

	useEffect(() => {
		const scrollerElem = anchorElem.parentElement;

		const update = () => {
			editor.getEditorState().read(() => {
				$updateTextFormatFloatingToolbar();
			});
		};

		window.addEventListener('resize', update);
		scrollerElem?.addEventListener('scroll', update);

		return () => {
			window.removeEventListener('resize', update);
			scrollerElem?.removeEventListener('scroll', update);
		};
	}, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

	useEffect(() => {
		editor.getEditorState().read(() => {
			$updateTextFormatFloatingToolbar();
		});

		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					$updateTextFormatFloatingToolbar();
				});
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					$updateTextFormatFloatingToolbar();
					return false;
				},
				COMMAND_PRIORITY_LOW,
			),
		);
	}, [editor, $updateTextFormatFloatingToolbar]);

	return (
		<div ref={popupCharStylesEditorRef} className={styles.floatingToolbar}>
			{editor.isEditable() && (
				<>
					<ToolbarButton
						spaced
						active={isBold}
						title="Bold"
						ariaLabel="Format text as bold"
						onClick={() =>
							editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
						}
					>
						<Bold className={styles.icon} />
					</ToolbarButton>

					<ToolbarButton
						spaced
						active={isItalic}
						title="Italic"
						ariaLabel="Format text as italics"
						onClick={() =>
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'italic',
							)
						}
					>
						<Italic className={styles.icon} />
					</ToolbarButton>

					<ToolbarButton
						spaced
						active={isUnderline}
						title="Underline"
						ariaLabel="Format text to underlined"
						onClick={() =>
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'underline',
							)
						}
					>
						<Underline className={styles.icon} />
					</ToolbarButton>

					<ToolbarButton
						spaced
						active={isStrikethrough}
						title="Strikethrough"
						ariaLabel="Format text with a strikethrough"
						onClick={() =>
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'strikethrough',
							)
						}
					>
						<Strikethrough className={styles.icon} />
					</ToolbarButton>
				</>
			)}
		</div>
	);
}
