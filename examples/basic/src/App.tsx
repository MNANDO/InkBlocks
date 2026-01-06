import {
	InkBlocksEditorView,
	useCreateInkBlocksEditor,
} from '@inkblocks/react';

function App() {
	const editor = useCreateInkBlocksEditor();

	return (
		<div className="bg-amber-900">
			<InkBlocksEditorView editor={editor} className="mx-auto" />
		</div>
	);
}

export default App;
