'use client';

import { defineExtension, configExtension } from 'lexical';
import { ReactExtension } from '@lexical/react/ReactExtension';
import { InkBlocksCoreExtension } from '@inkblocks/core';
import BlockPickerPlugin from '../plugins/BlockPickerPlugin';
import HorizontalRulePlugin from '../plugins/HorizontalRulePlugin';
import theme from '../InkBlocksTheme';
import { BlockDefinition } from '../blocks/types';

export function createInkBlocksReactExtension(blocks: BlockDefinition[]) {
	return defineExtension({
		name: 'InkBlocksReactExtension',
		theme,
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
