import { LexicalExtension } from 'lexical';
import { createInkBlocksReactExtension } from './extensions/InkBlocksReactExtension';

export default class InkBlocksReactEditor {
	private _lexicalExtension: LexicalExtension<
		unknown,
		string,
		unknown,
		unknown
	>;

	constructor() {
		this._lexicalExtension = createInkBlocksReactExtension();
	}

	get lexicalExtension() {
		return this._lexicalExtension;
	}
}
