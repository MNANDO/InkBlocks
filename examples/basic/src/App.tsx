import {
	InkBlocksEditorView,
	useCreateInkBlocksEditor,
} from '@inkblocks/react';

function App() {
	const editor = useCreateInkBlocksEditor();

	return (
		<div className="bg-amber-50">
			<InkBlocksEditorView editor={editor} />
		</div>
	);
}

export default App;
