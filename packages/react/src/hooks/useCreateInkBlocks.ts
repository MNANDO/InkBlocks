import { useState } from 'react';
import type { EditorThemeClasses } from 'lexical';
import InkBlocksReactEditor from '../InkBlocksReactEditor';
import type { ReactBlockConfig } from '../api/types';

export interface UseCreateInkBlocksOptions {
	/** Custom blocks defined with defineBlock() and React render functions */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	blocks?: Array<ReactBlockConfig<any>>;
	/** Custom theme to extend or override default InkBlocks theme */
	theme?: EditorThemeClasses;
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
