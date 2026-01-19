import { InkBlocksEditorView, useCreateInkBlocks } from '@inkblocks/react';
import { CalloutNode } from './blocks/CalloutNode';
import { CalloutPlugin } from './blocks/CalloutPlugin';
import { calloutBlock } from './blocks/calloutBlock';

function App() {
	const editor = useCreateInkBlocks({
		blocks: [calloutBlock],
		nodes: [CalloutNode],
	});

	return (
		<div>
			<InkBlocksEditorView editor={editor} className="mx-auto">
				<CalloutPlugin />
			</InkBlocksEditorView>
		</div>
	);
}

export default App;
