import { InkBlocksEditor } from '@inkblocks/core';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

export type InkBlocksEditorViewProps = {
	editor: InkBlocksEditor;
};

function InkBlocksEditorView(props: InkBlocksEditorViewProps) {
	const { editor } = props;

	return (
		<LexicalExtensionComposer
			extension={editor.lexicalExtension}
			contentEditable={null}
		>
			<div className="editor-shell">
				<div className="editor-container">
					<div className="editor-scroller">
						<div className="editor">
							<RichTextPlugin
								contentEditable={
									<ContentEditable className="editor-input" />
								}
								placeholder={
									<div className="editor-placeholder">
										Enter some text...
									</div>
								}
								ErrorBoundary={LexicalErrorBoundary}
							/>
						</div>
					</div>
				</div>
			</div>
		</LexicalExtensionComposer>
	);
}

export default InkBlocksEditorView;
