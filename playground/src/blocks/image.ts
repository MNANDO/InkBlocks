import { defineBlock } from '@inkblocks/core';

export type ImageData = {
	src: string;
	alt: string;
	caption: string;
	width: number;
};

export const imageBlock = defineBlock<ImageData>({
	id: 'image',
	schema: {
		src: { type: 'string', default: '' },
		alt: { type: 'string', default: '' },
		caption: { type: 'string', default: '' },
		width: { type: 'number', default: 100 },
	},
	container: {
		element: 'figure',
		className: 'image-block',
		themeKey: 'image',
	},
	export: {
		element: 'figure',
		className: 'image-block',
		content: (data) => {
			const elements: HTMLElement[] = [];

			if (data.src) {
				const img = document.createElement('img');
				img.src = data.src;
				img.alt = data.alt;
				img.style.width = `${data.width}%`;
				elements.push(img);
			}

			if (data.caption) {
				const figcaption = document.createElement('figcaption');
				figcaption.textContent = data.caption;
				elements.push(figcaption);
			}

			return elements;
		},
	},
});
