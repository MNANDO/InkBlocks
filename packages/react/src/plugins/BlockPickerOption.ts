import { MenuOption } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { BlockDefinition } from '../blocks/types';

export class BlockPickerOption extends MenuOption {
	readonly block: BlockDefinition;

	constructor(block: BlockDefinition) {
		super(block.title);
		this.block = block;
	}
}
