'use client';

import { InkBlocksEditor } from '@inkblocks/core';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useEffect, useState } from 'react';
import { CAN_USE_DOM } from '@lexical/utils';
import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin';

export type InkBlocksEditorViewProps = {
	editor: InkBlocksEditor;
	showFloatingToolbar?: boolean;
	className?: string;
};

function InkBlocksEditorView(props: InkBlocksEditorViewProps) {
	const { editor, className } = props;

	const [floatingAnchorElem, setFloatingAnchorElem] =
		useState<HTMLDivElement | null>(null);
	const [isSmallWidthViewport, setIsSmallWidthViewport] =
		useState<boolean>(false);

	const onRef = (_floatingAnchorElem: HTMLDivElement) => {
		if (_floatingAnchorElem !== null) {
			setFloatingAnchorElem(_floatingAnchorElem);
		}
	};

	useEffect(() => {
		const updateViewPortWidth = () => {
			const isNextSmallWidthViewport =
				CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

			if (isNextSmallWidthViewport !== isSmallWidthViewport) {
				setIsSmallWidthViewport(isNextSmallWidthViewport);
			}
		};
		updateViewPortWidth();
		window.addEventListener('resize', updateViewPortWidth);

		return () => {
			window.removeEventListener('resize', updateViewPortWidth);
		};
	}, [isSmallWidthViewport]);

	return (
		<LexicalExtensionComposer
			extension={editor.lexicalExtension}
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
					{floatingAnchorElem && !isSmallWidthViewport && (
						<>
							<FloatingToolbarPlugin
								anchorElem={floatingAnchorElem}
							/>
						</>
					)}
				</div>
			</div>
		</LexicalExtensionComposer>
	);
}

export default InkBlocksEditorView;
