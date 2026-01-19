import { Klass, LexicalExtension, LexicalNode } from 'lexical';
import { createInkBlocksReactExtension } from './extensions/InkBlocksReactExtension';
import { baseBlocks } from './blocks/baseBlocks';
import { ReactBlockDefinition } from './types';

export interface InkBlocksReactEditorOptions {
	/** Custom blocks to add to the block picker */
	blocks?: ReactBlockDefinition[];
	/** Custom Lexical nodes to register */
	nodes?: Array<Klass<LexicalNode>>;
	/** Replace default blocks entirely (default: false) */
	replaceDefaultBlocks?: boolean;
}

export default class InkBlocksReactEditor {
	private _lexicalExtension: LexicalExtension<
		unknown,
		string,
		unknown,
		unknown
	>;

	blocks: ReactBlockDefinition[];

	constructor(options: InkBlocksReactEditorOptions = {}) {
		const {
			blocks: customBlocks = [],
			nodes: customNodes = [],
			replaceDefaultBlocks = false,
		} = options;

		// Merge or replace blocks
		this.blocks = replaceDefaultBlocks
			? customBlocks
			: [...baseBlocks, ...customBlocks];

		// Create extension with custom nodes
		this._lexicalExtension = createInkBlocksReactExtension(
			this.blocks,
			customNodes,
		);
	}

	get lexicalExtension() {
		return this._lexicalExtension;
	}
}
