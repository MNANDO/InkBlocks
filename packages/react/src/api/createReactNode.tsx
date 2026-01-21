'use client';

import { createNodeFromBlock } from '@inkblocks/core';
import type { ReactNode } from 'react';
import { GeneratedBlockWrapper } from './GeneratedBlockWrapper';
import type { ReactBlockConfig } from './types';

export function createReactNode<TData extends Record<string, unknown>>(
	config: ReactBlockConfig<TData>,
) {
	const CoreNodeClass = createNodeFromBlock(config.block);

	// Create a new class that extends the core node with React decorate()
	return class extends CoreNodeClass {
		decorate(): ReactNode {
			return (
				<GeneratedBlockWrapper
					nodeKey={this.getKey()}
					data={this.getData()}
					render={config.render}
				/>
			);
		}
	};
}
