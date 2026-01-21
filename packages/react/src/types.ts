import type { ReactNode } from 'react';
import type { LexicalEditor } from 'lexical';

export type BlockCategory =
	| 'basic'
	| 'headings'
	| 'lists'
	| 'quotes'
	| 'dividers'
	| 'alignment'
	| 'advanced';

export type ReactBlockDefinition = {
	id: string;
	title: string;
	icon?: ReactNode;
	keywords: readonly string[];
	keyboardShortcut?: string;
	category: BlockCategory;
	insert: (args: { editor: LexicalEditor; queryString: string }) => void;
};
