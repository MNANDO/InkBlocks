import { useState } from 'react';
import { Klass, LexicalNode } from 'lexical';
import InkBlocksReactEditor from '../InkBlocksReactEditor';
import { ReactBlockDefinition } from '../types';

export interface UseCreateInkBlocksOptions {
	/** Custom blocks to add to the block picker */
	blocks?: ReactBlockDefinition[];
	/** Custom Lexical nodes to register */
	nodes?: Array<Klass<LexicalNode>>;
	/** Replace default blocks entirely (default: false) */
	replaceDefaultBlocks?: boolean;
}

export const useCreateInkBlocks = (
	options: UseCreateInkBlocksOptions = {},
) => {
	// Lazy initialization - only runs once on first render
	const [editor] = useState(() => new InkBlocksReactEditor(options));

	return editor;
};
