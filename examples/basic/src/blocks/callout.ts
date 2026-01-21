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
	createDOM: (data, config) => {
		const div = document.createElement('div');
		const themeClass = (config.theme as Record<string, string>)?.callout;
		div.className = themeClass ?? `callout callout-${data.calloutType}`;
		return div;
	},
	exportDOM: (data) => {
		const div = document.createElement('div');
		div.className = `callout callout-${data.calloutType}`;
		div.setAttribute('data-callout-type', data.calloutType);
		div.textContent = data.text;
		return { element: div };
	},
});
