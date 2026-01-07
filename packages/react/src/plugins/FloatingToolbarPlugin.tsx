import type { JSX } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import FloatingToolbarPortal from '../components/FloatingToolbarPortal';

export default function FloatingToolbarPlugin({
	anchorElem = document.body,
}: {
	anchorElem?: HTMLElement;
}): JSX.Element | null {
	const [editor] = useLexicalComposerContext();
	return <FloatingToolbarPortal editor={editor} anchorElem={anchorElem} />;
}
