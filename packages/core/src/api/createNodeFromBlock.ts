import {
	DecoratorNode,
	type DOMExportOutput,
	type EditorConfig,
	type LexicalEditor,
	type LexicalNode,
	type NodeKey,
	type SerializedLexicalNode,
	type Spread,
} from 'lexical';
import type { BlockConfig, BlockDefinition } from './types';

export type SerializedBlockNode<TData> = Spread<
	{
		data: TData;
	},
	SerializedLexicalNode
>;

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

		static clone(node: GeneratedBlockNode<TData>): GeneratedBlockNode<TData> {
			return new this(node.__data, node.__key);
		}

		createDOM(config: EditorConfig): HTMLElement {
			const blockConfig: BlockConfig = {
				theme: config.theme,
			};
			return block.createDOM(this.__data, blockConfig);
		}

		updateDOM(
			prevNode: GeneratedBlockNode<TData>,
			dom: HTMLElement,
			config: EditorConfig,
		): boolean {
			if (block.updateDOM) {
				const blockConfig: BlockConfig = {
					theme: config.theme,
				};
				return block.updateDOM(prevNode.__data, this.__data, dom, blockConfig);
			}
			return false;
		}

		exportDOM(_editor: LexicalEditor): DOMExportOutput {
			if (block.exportDOM) {
				return block.exportDOM(this.__data);
			}
			const blockConfig: BlockConfig = {
				theme: {},
			};
			return { element: block.createDOM(this.__data, blockConfig) };
		}

		exportJSON(): SerializedBlockNode<TData> {
			return {
				type: block.id,
				version: 1,
				data: this.__data,
			};
		}

		static importJSON(json: SerializedBlockNode<TData>): GeneratedBlockNode<TData> {
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
