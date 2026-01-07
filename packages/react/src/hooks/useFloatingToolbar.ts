import {
	$getSelection,
	$isParagraphNode,
	$isRangeSelection,
	$isTextNode,
	getDOMSelection,
	LexicalEditor,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { mergeRegister } from '@lexical/utils';

import { getSelectedNode } from '../utils';

export type FloatingToolbarState = {
	isVisible: boolean;
	isBold: boolean;
	isItalic: boolean;
	isUnderline: boolean;
	isUppercase: boolean;
	isLowercase: boolean;
	isCapitalize: boolean;
	isStrikethrough: boolean;
	isSubscript: boolean;
	isSuperscript: boolean;
};

const DEFAULT_STATE: FloatingToolbarState = {
	isVisible: false,
	isBold: false,
	isItalic: false,
	isUnderline: false,
	isUppercase: false,
	isLowercase: false,
	isCapitalize: false,
	isStrikethrough: false,
	isSubscript: false,
	isSuperscript: false,
};

export function useFloatingToolbar(
	editor: LexicalEditor
): FloatingToolbarState {
	const [toolbarState, setToolbarState] =
		useState<FloatingToolbarState>(DEFAULT_STATE);

	const update = useCallback(() => {
		editor.getEditorState().read(() => {
			if (editor.isComposing()) return;

			const selection = $getSelection();
			const nativeSelection = getDOMSelection(editor._window);
			const rootElement = editor.getRootElement();

			if (
				nativeSelection !== null &&
				(!$isRangeSelection(selection) ||
					rootElement === null ||
					!rootElement.contains(nativeSelection.anchorNode))
			) {
				setToolbarState(DEFAULT_STATE);
				return;
			}

			if (!$isRangeSelection(selection)) return;

			const node = getSelectedNode(selection);

			const hasText = selection.getTextContent() !== '';
			const isText =
				hasText && ($isTextNode(node) || $isParagraphNode(node));

			const rawTextContent = selection
				.getTextContent()
				.replace(/\n/g, '');
			const isCollapsedWhitespaceSelection =
				!selection.isCollapsed() && rawTextContent === '';

			if (!isText || isCollapsedWhitespaceSelection) {
				setToolbarState(DEFAULT_STATE);
				return;
			}

			setToolbarState({
				isVisible: true,
				isBold: selection.hasFormat('bold'),
				isItalic: selection.hasFormat('italic'),
				isUnderline: selection.hasFormat('underline'),
				isUppercase: selection.hasFormat('uppercase'),
				isLowercase: selection.hasFormat('lowercase'),
				isCapitalize: selection.hasFormat('capitalize'),
				isStrikethrough: selection.hasFormat('strikethrough'),
				isSubscript: selection.hasFormat('subscript'),
				isSuperscript: selection.hasFormat('superscript'),
			});
		});
	}, [editor]);

	useEffect(() => {
		document.addEventListener('selectionchange', update);
		return () => document.removeEventListener('selectionchange', update);
	}, [update]);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(() => update()),
			editor.registerRootListener(() => {
				if (editor.getRootElement() === null) {
					setToolbarState(DEFAULT_STATE);
				}
			})
		);
	}, [editor, update]);

	return toolbarState;
}
