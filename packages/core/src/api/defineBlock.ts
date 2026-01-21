import type { BlockDefinition } from './types';

export function defineBlock<TData extends Record<string, unknown>>(
	definition: BlockDefinition<TData>,
): BlockDefinition<TData> {
	return definition;
}
