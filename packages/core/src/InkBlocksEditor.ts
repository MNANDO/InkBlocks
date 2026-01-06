import {
	defineExtension,
	ExtensionConfigBase,
	LexicalExtension,
} from 'lexical';

type InkBlocksLexical = LexicalExtension<
	ExtensionConfigBase,
	string,
	unknown,
	unknown
>;

export class InkBlocksEditor {
	private lexical: InkBlocksLexical;

	constructor() {
		this.lexical = defineExtension({
			name: 'InkBlocksEditor',
		});
	}

	get lexicalExtension(): InkBlocksLexical {
		return this.lexical;
	}

	static create(): InkBlocksEditor {
		return new InkBlocksEditor();
	}
}
