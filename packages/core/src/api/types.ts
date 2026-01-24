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

/** Supported HTML element types for block containers */
export type ContainerElement =
	| 'div'
	| 'figure'
	| 'section'
	| 'aside'
	| 'article'
	| 'blockquote';

/** Configuration for the block's DOM container (maps to createDOM) */
export type ContainerConfig<TData> = {
	/** HTML element tag (default: 'div') */
	element?: ContainerElement;
	/** CSS class - static string or function of data */
	className?: string | ((data: TData) => string);
	/** Theme key to look up class from editor theme */
	themeKey?: string;
	/** Data attributes to add to the container */
	dataAttributes?:
		| Record<string, string>
		| ((data: TData) => Record<string, string>);
};

/** Configuration for HTML export/serialization (maps to exportDOM) */
export type ExportConfig<TData> = {
	/** HTML element tag (defaults to container.element) */
	element?: ContainerElement | 'img' | 'hr' | 'iframe';
	/** CSS class for exported HTML */
	className?: string | ((data: TData) => string);
	/** Data attributes for exported HTML */
	dataAttributes?:
		| Record<string, string>
		| ((data: TData) => Record<string, string>);
	/** Content to render inside the element */
	content?: (data: TData) => string | HTMLElement | HTMLElement[];
};

export type BlockDefinition<
	TData extends Record<string, unknown> = Record<string, unknown>,
> = {
	id: string;
	schema: BlockSchema;

	/** Declarative container configuration */
	container?: ContainerElement | ContainerConfig<TData>;
	/** Declarative export configuration */
	export?: ExportConfig<TData>;
};
