import { InkBlocksEditorView, useCreateInkBlocks } from '@inkblocks/react';

function App() {
	const editor = useCreateInkBlocks();

	return (
		<div className="bg-amber-900">
			<InkBlocksEditorView editor={editor} className="mx-auto" />
		</div>
	);
}

export default App;
