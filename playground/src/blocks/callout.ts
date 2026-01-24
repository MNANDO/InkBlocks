import { defineBlock } from '@inkblocks/core';

export type CalloutType = 'info' | 'warning' | 'success' | 'error';

export type CalloutData = {
	calloutType: CalloutType;
	text: string;
};

export const calloutBlock = defineBlock<CalloutData>({
	id: 'callout',
	schema: {
		calloutType: { type: 'string', default: 'info' },
		text: { type: 'string', default: 'This is a callout block. Edit me!' },
	},
	container: {
		element: 'div',
		className: (data) => `callout callout-${data.calloutType}`,
		themeKey: 'callout',
	},
	export: {
		dataAttributes: (data) => ({ 'callout-type': data.calloutType }),
		content: (data) => data.text,
	},
});
