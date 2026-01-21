'use client';

import {
	defineExtension,
	configExtension,
	type EditorThemeClasses,
	type Klass,
	type LexicalNode,
} from 'lexical';
import { ReactExtension } from '@lexical/react/ReactExtension';
import { InkBlocksCoreExtension } from '@inkblocks/core';
import BlockPickerPlugin from '../plugins/BlockPickerPlugin';
import HorizontalRulePlugin from '../plugins/HorizontalRulePlugin';
import defaultTheme from '../InkBlocksTheme';
import type { ReactBlockDefinition } from '../types';

export interface CreateInkBlocksReactExtensionOptions {
	blocks: ReactBlockDefinition[];
	customNodes?: Array<Klass<LexicalNode>>;
	customTheme?: EditorThemeClasses;
}

export function createInkBlocksReactExtension(
	options: CreateInkBlocksReactExtensionOptions,
) {
	const { blocks, customNodes = [], customTheme } = options;

	// Merge custom theme with default theme
	const mergedTheme = customTheme
		? { ...defaultTheme, ...customTheme }
		: defaultTheme;

	return defineExtension({
		name: 'InkBlocksReactExtension',
		theme: mergedTheme,
		nodes: customNodes,
		dependencies: [
			InkBlocksCoreExtension,
			configExtension(ReactExtension, {
				contentEditable: null,
				decorators: [
					<BlockPickerPlugin blocks={blocks} key="block-picker-plugin" />,
					<HorizontalRulePlugin key="horizontal-rule-plugin" />,
				],
			}),
		],
	});
}
