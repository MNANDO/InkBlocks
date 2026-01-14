'use client';

import { defineExtension, configExtension } from 'lexical';
import { ReactExtension } from '@lexical/react/ReactExtension';
import { InkBlocksCoreExtension } from '@inkblocks/core';
import BlockPickerPlugin from '../plugins/BlockPickerPlugin';
import theme from '../InkBlocksTheme';

export function createInkBlocksReactExtension() {
	return defineExtension({
		name: 'InkBlocksReactExtension',
		theme,
		dependencies: [
			InkBlocksCoreExtension,
			configExtension(ReactExtension, {
				contentEditable: null,
				decorators: [<BlockPickerPlugin key="block-picker-plugin" />],
			}),
		],
	});
}
