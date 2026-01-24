import {
	DecoratorNode,
	type DOMExportOutput,
	type EditorConfig,
	type EditorThemeClasses,
	type LexicalNode,
	type NodeKey,
	type SerializedLexicalNode,
	type Spread,
} from 'lexical';
import type {
	BlockConfig,
	BlockDefinition,
	ContainerConfig,
	ContainerElement,
	ExportConfig,
} from './types';

export type SerializedBlockNode<TData> = Spread<
	{
		data: TData;
	},
	SerializedLexicalNode
>;

// Helper functions to convert declarative config to Lexical DOM methods

function normalizeContainer<TData>(
	cfg: ContainerElement | ContainerConfig<TData> | undefined,
): ContainerConfig<TData> {
	if (!cfg) return { element: 'div' };
	if (typeof cfg === 'string') return { element: cfg };
	return { element: 'div', ...cfg };
}

function getThemeValue(
	theme: EditorThemeClasses,
	key: string,
): string | undefined {
	const value = (theme as Record<string, unknown>)[key];
	return typeof value === 'string' ? value : undefined;
}

function resolveClassName<TData>(
	className: string | ((data: TData) => string) | undefined,
	data: TData,
): string | undefined {
	if (!className) return undefined;
	return typeof className === 'function' ? className(data) : className;
}

function resolveDataAttributes<TData>(
	attrs:
		| Record<string, string>
		| ((data: TData) => Record<string, string>)
		| undefined,
	data: TData,
): Record<string, string> {
	if (!attrs) return {};
	return typeof attrs === 'function' ? attrs(data) : attrs;
}

function buildCreateDOM<TData>(
	container: ContainerConfig<TData>,
): (data: TData, config: BlockConfig) => HTMLElement {
	return (data, config) => {
		const el = document.createElement(container.element ?? 'div');

		const cls = resolveClassName(container.className, data);
		const themeClass = container.themeKey
			? getThemeValue(config.theme, container.themeKey)
			: undefined;

		const combinedClass = [cls, themeClass].filter(Boolean).join(' ');
		if (combinedClass) {
			el.className = combinedClass;
		}

		const attrs = resolveDataAttributes(container.dataAttributes, data);
		for (const [k, v] of Object.entries(attrs)) {
			el.setAttribute(`data-${k}`, v);
		}

		return el;
	};
}

function buildExportDOM<TData>(
	exportCfg: ExportConfig<TData> | undefined,
	container: ContainerConfig<TData>,
): (data: TData) => { element: HTMLElement } {
	return (data) => {
		const el = document.createElement(
			exportCfg?.element ?? container.element ?? 'div',
		);

		// Use export className if provided, otherwise fall back to container className
		const cls =
			resolveClassName(exportCfg?.className, data) ??
			resolveClassName(container.className, data);
		if (cls) {
			el.className = cls;
		}

		// Merge data attributes from both configs
		const containerAttrs = resolveDataAttributes(
			container.dataAttributes,
			data,
		);
		const exportAttrs = resolveDataAttributes(
			exportCfg?.dataAttributes,
			data,
		);
		const attrs = { ...containerAttrs, ...exportAttrs };
		for (const [k, v] of Object.entries(attrs)) {
			el.setAttribute(`data-${k}`, v);
		}

		// Render content if provided
		if (exportCfg?.content) {
			const content = exportCfg.content(data);
			if (typeof content === 'string') {
				el.innerHTML = content;
			} else if (Array.isArray(content)) {
				for (const child of content) {
					el.appendChild(child);
				}
			} else {
				el.appendChild(content);
			}
		}

		return { element: el };
	};
}

// Base class with getData/setData methods
export abstract class GeneratedBlockNode<
	TData extends Record<string, unknown>,
> extends DecoratorNode<unknown> {
	__data: TData;

	constructor(data: TData, key?: NodeKey) {
		super(key);
		this.__data = data;
	}

	getData(): TData {
		return this.__data;
	}

	setData(newData: Partial<TData>): void {
		const writable = this.getWritable() as GeneratedBlockNode<TData>;
		writable.__data = { ...writable.__data, ...newData };
	}

	decorate(): unknown {
		return null;
	}
}

export function createNodeFromBlock<TData extends Record<string, unknown>>(
	block: BlockDefinition<TData>,
): typeof GeneratedBlockNode<TData> & {
	new (data: TData, key?: NodeKey): GeneratedBlockNode<TData>;
	getType(): string;
	clone(node: LexicalNode): LexicalNode;
	importJSON(json: SerializedBlockNode<TData>): GeneratedBlockNode<TData>;
} {
	return class extends GeneratedBlockNode<TData> {
		static getType(): string {
			return block.id;
		}

		static clone(
			node: GeneratedBlockNode<TData>,
		): GeneratedBlockNode<TData> {
			return new this(node.__data, node.__key);
		}

		createDOM(config: EditorConfig): HTMLElement {
			const blockConfig: BlockConfig = {
				theme: config.theme,
			};
			const container = normalizeContainer(block.container);
			return buildCreateDOM(container)(this.__data, blockConfig);
		}

		updateDOM(): boolean {
			return false;
		}

		exportDOM(): DOMExportOutput {
			const container = normalizeContainer(block.container);
			return buildExportDOM(block.export, container)(this.__data);
		}

		exportJSON(): SerializedBlockNode<TData> {
			return {
				type: block.id,
				version: 1,
				data: this.__data,
			};
		}

		static importJSON(
			json: SerializedBlockNode<TData>,
		): GeneratedBlockNode<TData> {
			return new this(json.data);
		}
	};
}

export function buildDefaultData<TData extends Record<string, unknown>>(
	block: BlockDefinition<TData>,
): TData {
	const data: Record<string, unknown> = {};
	for (const [key, field] of Object.entries(block.schema)) {
		if (field.default !== undefined) {
			data[key] = field.default;
		}
	}
	return data as TData;
}
