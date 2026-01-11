'use client';

import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin';
import { useMemo, useState } from 'react';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { defineExtension, EditorState, LexicalEditor } from 'lexical';
import { HorizontalRuleExtension } from '@lexical/extension';
import BlockPlugin from './plugins/BlockPlugin';
import InkBlocksNodes from './nodes/InkBlocksNodes';
import theme from './InkBlocksTheme';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';

export type InkBlocksEditorViewProps = {
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

	const inkBlocksLexicalExtension = useMemo(
		() =>
			defineExtension({
				name: 'InkBlocksEditor',
				nodes: InkBlocksNodes,
				theme: theme,
				dependencies: [HorizontalRuleExtension],
			}),
		[]
	);

	return (
		<LexicalExtensionComposer
			extension={inkBlocksLexicalExtension}
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
					<BlockPlugin />
					<ListPlugin />
					<CheckListPlugin />
					<TabIndentationPlugin />
				</div>
			</div>
		</LexicalExtensionComposer>
	);
}

export default InkBlocksEditorView;
