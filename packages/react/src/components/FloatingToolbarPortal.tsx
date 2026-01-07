import type { JSX } from 'react';
import type { LexicalEditor } from 'lexical';
import { createPortal } from 'react-dom';

import FloatingToolbar from '../components/FloatingToolbar';
import { useFloatingToolbar } from '../hooks/useFloatingToolbar';

export default function FloatingToolbarPortal({
	editor,
	anchorElem,
}: {
	editor: LexicalEditor;
	anchorElem: HTMLElement;
}): JSX.Element | null {
	const state = useFloatingToolbar(editor);

	if (!state.isVisible) return null;

	return createPortal(
		<FloatingToolbar editor={editor} anchorElem={anchorElem} {...state} />,
		anchorElem
	);
}
