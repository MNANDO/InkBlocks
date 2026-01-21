import type { EditorThemeClasses } from 'lexical';

export type BlockSchema = {
	[key: string]: {
		type: 'string' | 'number' | 'boolean';
		default?: unknown;
	};
};

export type BlockConfig = {
	theme: EditorThemeClasses;
};

export type BlockDefinition<
	TData extends Record<string, unknown> = Record<string, unknown>,
> = {
	id: string;
	schema: BlockSchema;
	createDOM: (data: TData, config: BlockConfig) => HTMLElement;
	updateDOM?: (
		prevData: TData,
		nextData: TData,
		dom: HTMLElement,
		config: BlockConfig,
	) => boolean;
	exportDOM?: (data: TData) => { element: HTMLElement };
};
