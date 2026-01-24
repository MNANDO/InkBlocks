import { HorizontalRuleNode } from '@lexical/extension';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { Klass, LexicalNode } from 'lexical';

export const InkBlocksBaseNodes: Array<Klass<LexicalNode>> = [
	HeadingNode,
	ListNode,
	ListItemNode,
	QuoteNode,
	HorizontalRuleNode,
];
