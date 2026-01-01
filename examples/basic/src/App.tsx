import { helloWorld } from '@inkblocks/core';
import { InkBlocksEditorView } from '@inkblocks/react';

function App() {
	const message = helloWorld;

	return (
		<div>
			<p>{message}</p>
			<InkBlocksEditorView />
		</div>
	);
}

export default App;
