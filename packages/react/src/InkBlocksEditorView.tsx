'use client';

import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin';
import { useState, ReactNode } from 'react';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from 'lexical';
import InkBlocksReactEditor from './InkBlocksReactEditor';
import BlockControlPlugin from './plugins/BlockControlPlugin';

export type InkBlocksEditorViewProps = {
	editor: InkBlocksReactEditor;
	/** Custom plugins to render inside the editor context */
	children?: ReactNode;
	onChange?: (
		editorState: EditorState,
		editor: LexicalEditor,
		tags: Set<string>,
	) => void;
	showFloatingToolbar?: boolean;
	showBlockHandle?: boolean;
	placeholder?: string;
	className?: string;
};

function InkBlocksEditorView(props: InkBlocksEditorViewProps) {
	const {
		className,
		children,
		showFloatingToolbar = true,
		showBlockHandle = true,
		onChange,
	} = props;

	const [floatingAnchorElem, setFloatingAnchorElem] =
		useState<HTMLDivElement | null>(null);

	const onRef = (_floatingAnchorElem: HTMLDivElement) => {
		if (_floatingAnchorElem !== null) {
			setFloatingAnchorElem(_floatingAnchorElem);
		}
	};

	const editorPlaceholder =
		props.placeholder ?? "Enter some text or type '/' for commands";

	return (
		<LexicalExtensionComposer
			extension={props.editor.lexicalExtension}
			contentEditable={null}
		>
			<div
				className={`ib-editor-shell ${showBlockHandle ? 'ib-editor-shell--with-block-handle' : ''} ${className ?? ''}`}
			>
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
								{editorPlaceholder}
							</div>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					{floatingAnchorElem && showFloatingToolbar && (
						<FloatingToolbarPlugin
							anchorElem={floatingAnchorElem}
						/>
					)}
					{floatingAnchorElem && showBlockHandle && (
						<BlockControlPlugin
							anchorElem={floatingAnchorElem}
							blocks={props.editor.blocks}
						/>
					)}
					{children}
					<OnChangePlugin onChange={onChange} />
				</div>
			</div>
		</LexicalExtensionComposer>
	);
}

export default InkBlocksEditorView;
