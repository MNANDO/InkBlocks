import {
	HorizontalRuleExtension,
	TabIndentationExtension,
} from '@lexical/extension';
import { defineExtension } from 'lexical';
import { CheckListExtension, ListExtension } from '@lexical/list';
import { InkBlocksBaseNodes } from './nodes/InkBlocksBaseNodes';

export const InkBlocksCoreExtension = defineExtension({
	name: 'InkBlocksCore',
	nodes: InkBlocksBaseNodes,
	dependencies: [
		HorizontalRuleExtension,
		ListExtension,
		CheckListExtension,
		TabIndentationExtension,
	],
});
