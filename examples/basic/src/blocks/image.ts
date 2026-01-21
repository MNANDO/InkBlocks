import { defineBlock } from '@inkblocks/core';

export type ImageData = {
	src: string;
	alt: string;
	caption: string;
};

export const imageBlock = defineBlock<ImageData>({
	id: 'image',
	schema: {
		src: { type: 'string', default: '' },
		alt: { type: 'string', default: '' },
		caption: { type: 'string', default: '' },
	},
	createDOM: (_data, config) => {
		const figure = document.createElement('figure');
		const themeClass = (config.theme as Record<string, string>)?.image;
		figure.className = themeClass ?? 'image-block';
		return figure;
	},
	exportDOM: (data) => {
		const figure = document.createElement('figure');
		figure.className = 'image-block';

		if (data.src) {
			const img = document.createElement('img');
			img.src = data.src;
			img.alt = data.alt;
			figure.appendChild(img);
		}

		if (data.caption) {
			const figcaption = document.createElement('figcaption');
			figcaption.textContent = data.caption;
			figure.appendChild(figcaption);
		}

		return { element: figure };
	},
});
