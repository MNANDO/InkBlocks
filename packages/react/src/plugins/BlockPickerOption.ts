import { MenuOption } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { ReactBlockDefinition } from '../types';

export class BlockPickerOption extends MenuOption {
	readonly block: ReactBlockDefinition;

	constructor(block: ReactBlockDefinition) {
		super(block.title);
		this.block = block;
	}
}
