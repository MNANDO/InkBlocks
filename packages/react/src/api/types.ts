import type { BlockDefinition } from '@inkblocks/core';
import type { EditorThemeClasses } from 'lexical';
import type { ReactElement, ReactNode } from 'react';

export type BlockCategory =
	| 'basic'
	| 'headings'
	| 'lists'
	| 'quotes'
	| 'dividers'
	| 'alignment'
	| 'advanced';

export type BlockRenderProps<TData> = {
	data: TData;
	onChange: (newData: Partial<TData>) => void;
	isSelected: boolean;
	nodeKey: string;
	theme: EditorThemeClasses;
};

export type ReactBlockConfig<
	TData extends Record<string, unknown> = Record<string, unknown>,
> = {
	block: BlockDefinition<TData>;
	title: string;
	icon?: ReactNode;
	keywords: readonly string[];
	category: BlockCategory;
	render: (props: BlockRenderProps<TData>) => ReactElement;
};
