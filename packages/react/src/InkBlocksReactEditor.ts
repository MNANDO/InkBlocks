import { LexicalExtension } from 'lexical';
import { createInkBlocksReactExtension } from './extensions/InkBlocksReactExtension';
import { BlockDefinition } from './blocks/types';
import { baseBlocks } from './blocks/baseBlocks';

export default class InkBlocksReactEditor {
	private _lexicalExtension: LexicalExtension<
		unknown,
		string,
		unknown,
		unknown
	>;

	blocks: BlockDefinition[];

	constructor() {
		this.blocks = baseBlocks;
		this._lexicalExtension = createInkBlocksReactExtension(this.blocks);
	}

	get lexicalExtension() {
		return this._lexicalExtension;
	}
}
