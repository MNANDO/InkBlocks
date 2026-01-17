import { InkBlocksEditorView, useCreateInkBlocks } from '@inkblocks/react';

function App() {
	const editor = useCreateInkBlocks();

	return (
		<div>
			<InkBlocksEditorView editor={editor} className="mx-auto" />
		</div>
	);
}

export default App;
