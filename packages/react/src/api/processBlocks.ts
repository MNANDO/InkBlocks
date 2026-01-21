import { buildDefaultData } from '@inkblocks/core';
import type { ComponentType } from 'react';
import type { Klass, LexicalNode } from 'lexical';
import type { ReactBlockDefinition } from '../types';
import type { ReactBlockConfig } from './types';
import { createReactNode } from './createReactNode';
import { createBlockPlugin, getInsertCommand } from './createBlockPlugin';

export type ProcessedBlocks = {
	nodes: Array<Klass<LexicalNode>>;
	plugins: Array<ComponentType>;
	pickerBlocks: ReactBlockDefinition[];
};

export function processBlocks(
	configs: Array<ReactBlockConfig<Record<string, unknown>>>,
): ProcessedBlocks {
	const nodes: Array<Klass<LexicalNode>> = [];
	const plugins: Array<ComponentType> = [];
	const pickerBlocks: ReactBlockDefinition[] = [];

	for (const config of configs) {
		const NodeClass = createReactNode(config);
		const Plugin = createBlockPlugin(config.block, NodeClass);

		nodes.push(NodeClass as Klass<LexicalNode>);
		plugins.push(Plugin);

		const INSERT_COMMAND = getInsertCommand(config.block.id);

		pickerBlocks.push({
			id: config.block.id,
			title: config.title,
			icon: config.icon,
			keywords: config.keywords,
			category: config.category,
			insert: ({ editor }) => {
				const defaultData = buildDefaultData(config.block);
				editor.dispatchCommand(INSERT_COMMAND, defaultData);
			},
		});
	}

	return { nodes, plugins, pickerBlocks };
}
