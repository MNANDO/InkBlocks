import { LexicalExtension } from 'lexical';
import { createInkBlocksReactExtension } from './extensions/InkBlocksReactExtension';
import { baseBlocks } from './blocks/baseBlocks';
import { ReactBlockDefinition } from './types';

export default class InkBlocksReactEditor {
	private _lexicalExtension: LexicalExtension<
		unknown,
		string,
		unknown,
		unknown
	>;

	blocks: ReactBlockDefinition[];

	constructor() {
		this.blocks = baseBlocks;
		this._lexicalExtension = createInkBlocksReactExtension(this.blocks);
	}

	get lexicalExtension() {
		return this._lexicalExtension;
	}
}
