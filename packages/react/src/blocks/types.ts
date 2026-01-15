import type { JSX } from 'react';
import type { LexicalEditor } from 'lexical';

export type BlockCategory =
	| 'basic'
	| 'headings'
	| 'lists'
	| 'quotes'
	| 'dividers'
	| 'alignment'
	| 'advanced';

export type BlockDefinition = {
	id: string;
	title: string;
	icon?: JSX.Element;
	keywords: readonly string[];
	keyboardShortcut?: string;
	category: BlockCategory;
	insert: (args: { editor: LexicalEditor; queryString: string }) => void;
};
