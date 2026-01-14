'use client';

import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin';
import { useState } from 'react';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from 'lexical';
import InkBlocksReactEditor from './InkBlocksReactEditor';

export type InkBlocksEditorViewProps = {
	editor: InkBlocksReactEditor;
	onChange?: (
		editorState: EditorState,
		editor: LexicalEditor,
		tags: Set<string>
	) => void;
	showFloatingToolbar?: boolean;
	className?: string;
};

function InkBlocksEditorView(props: InkBlocksEditorViewProps) {
	const { className, showFloatingToolbar = true, onChange } = props;

	const [floatingAnchorElem, setFloatingAnchorElem] =
		useState<HTMLDivElement | null>(null);

	const onRef = (_floatingAnchorElem: HTMLDivElement) => {
		if (_floatingAnchorElem !== null) {
			setFloatingAnchorElem(_floatingAnchorElem);
		}
	};

	return (
		<LexicalExtensionComposer
			extension={props.editor.lexicalExtension}
			contentEditable={null}
		>
			<div className={`ib-editor-shell ${className}`}>
				<div className="ib-editor-container">
					<RichTextPlugin
						contentEditable={
							<div className="ib-editor-scroller">
								<div ref={onRef} className="ib-editor">
									<ContentEditable className="ib-editor-input" />
								</div>
							</div>
						}
						placeholder={
							<div className="ib-editor-placeholder">
								Enter some text...
							</div>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					{floatingAnchorElem && showFloatingToolbar && (
						<FloatingToolbarPlugin
							anchorElem={floatingAnchorElem}
						/>
					)}
					<OnChangePlugin onChange={onChange} />
				</div>
			</div>
		</LexicalExtensionComposer>
	);
}

export default InkBlocksEditorView;
