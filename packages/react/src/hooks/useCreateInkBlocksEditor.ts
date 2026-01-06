import { InkBlocksEditor } from '@inkblocks/core';

export const useCreateInkBlocksEditor = () => {
	const inkBlocksEditor = InkBlocksEditor.create();

	return inkBlocksEditor;
};
