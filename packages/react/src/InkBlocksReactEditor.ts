import type { ComponentType } from 'react';
import type { EditorThemeClasses, LexicalExtension } from 'lexical';
import { createInkBlocksReactExtension } from './extensions/InkBlocksReactExtension';
import { baseBlocks } from './blocks/baseBlocks';
import type { ReactBlockDefinition } from './types';
import type { ReactBlockConfig } from './api/types';
import { processBlocks } from './api/processBlocks';

export interface InkBlocksReactEditorOptions {
	/** Custom blocks defined with defineBlock() and React render functions */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	blocks?: Array<ReactBlockConfig<any>>;
	/** Custom theme to extend or override default InkBlocks theme */
	theme?: EditorThemeClasses;
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

	/** Blocks available in the block picker */
	blocks: ReactBlockDefinition[];

	/** Generated plugins that need to be rendered */
	generatedPlugins: Array<ComponentType>;

	constructor(options: InkBlocksReactEditorOptions = {}) {
		const {
			blocks: customBlockConfigs = [],
			theme: customTheme,
			replaceDefaultBlocks = false,
		} = options;

		// Process custom block configs into nodes, plugins, and picker blocks
		const { nodes, plugins, pickerBlocks } = processBlocks(customBlockConfigs);

		// Store generated plugins to render in EditorView
		this.generatedPlugins = plugins;

		// Merge or replace blocks for the block picker
		this.blocks = replaceDefaultBlocks
			? pickerBlocks
			: [...baseBlocks, ...pickerBlocks];

		// Create extension with custom nodes and theme
		this._lexicalExtension = createInkBlocksReactExtension({
			blocks: this.blocks,
			customNodes: nodes,
			customTheme,
		});
	}

	get lexicalExtension() {
		return this._lexicalExtension;
	}
}
