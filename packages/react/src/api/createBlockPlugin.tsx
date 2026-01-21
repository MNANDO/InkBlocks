'use client';

import { buildDefaultData, type BlockDefinition } from '@inkblocks/core';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
	$insertNodes,
	COMMAND_PRIORITY_EDITOR,
	createCommand,
	type Klass,
	type LexicalCommand,
	type LexicalNode,
} from 'lexical';
import { useEffect } from 'react';

const commandRegistry = new Map<string, LexicalCommand<unknown>>();

export function getInsertCommand<TData>(
	blockId: string,
): LexicalCommand<TData> {
	if (!commandRegistry.has(blockId)) {
		commandRegistry.set(
			blockId,
			createCommand<TData>(`INSERT_${blockId.toUpperCase()}_COMMAND`),
		);
	}
	return commandRegistry.get(blockId) as LexicalCommand<TData>;
}

export function createBlockPlugin<TData extends Record<string, unknown>>(
	block: BlockDefinition<TData>,
	NodeClass: Klass<LexicalNode>,
) {
	const INSERT_COMMAND = getInsertCommand<TData>(block.id);

	return function GeneratedBlockPlugin(): null {
		const [editor] = useLexicalComposerContext();

		useEffect(() => {
			return editor.registerCommand<TData>(
				INSERT_COMMAND,
				(payload) => {
					editor.update(() => {
						const data = payload ?? buildDefaultData(block);
						const node = new (NodeClass as new (data: TData) => LexicalNode)(
							data,
						);
						$insertNodes([node]);
					});
					return true;
				},
				COMMAND_PRIORITY_EDITOR,
			);
		}, [editor]);

		return null;
	};
}
