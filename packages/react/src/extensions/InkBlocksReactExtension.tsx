'use client';

import { defineExtension, configExtension, Klass, LexicalNode } from 'lexical';
import { ReactExtension } from '@lexical/react/ReactExtension';
import { InkBlocksCoreExtension } from '@inkblocks/core';
import BlockPickerPlugin from '../plugins/BlockPickerPlugin';
import HorizontalRulePlugin from '../plugins/HorizontalRulePlugin';
import theme from '../InkBlocksTheme';
import { ReactBlockDefinition } from '../types';

export function createInkBlocksReactExtension(
	blocks: ReactBlockDefinition[],
	customNodes: Array<Klass<LexicalNode>> = [],
) {
	return defineExtension({
		name: 'InkBlocksReactExtension',
		theme,
		nodes: customNodes,
		dependencies: [
			InkBlocksCoreExtension,
			configExtension(ReactExtension, {
				contentEditable: null,
				decorators: [
					<BlockPickerPlugin
						blocks={blocks}
						key="block-picker-plugin"
					/>,
					<HorizontalRulePlugin key="horizontal-rule-plugin" />,
				],
			}),
		],
	});
}
