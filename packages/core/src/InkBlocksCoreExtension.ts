import {
	HorizontalRuleExtension,
	TabIndentationExtension,
} from '@lexical/extension';
import { defineExtension } from 'lexical';
import { CheckListExtension, ListExtension } from '@lexical/list';
import { InkBlocksNodes } from './nodes/InkBlocksNodes';

export const InkBlocksCoreExtension = defineExtension({
	name: 'InkBlocksCore',
	nodes: InkBlocksNodes,
	dependencies: [
		HorizontalRuleExtension,
		ListExtension,
		CheckListExtension,
		TabIndentationExtension,
	],
});
