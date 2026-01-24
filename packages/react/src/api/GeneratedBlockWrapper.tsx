'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, $getSelection, $isNodeSelection } from 'lexical';
import { useCallback, useEffect, useState, type ReactElement } from 'react';
import type { BlockRenderProps } from './types';

type Props<TData extends Record<string, unknown>> = {
	nodeKey: string;
	data: TData;
	render: (props: BlockRenderProps<TData>) => ReactElement;
};

export function GeneratedBlockWrapper<TData extends Record<string, unknown>>({
	nodeKey,
	data: initialData,
	render: Render,
}: Props<TData>): ReactElement {
	const [editor] = useLexicalComposerContext();
	const [isSelected, setIsSelected] = useState(false);
	const [data, setData] = useState<TData>(initialData);

	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const selection = $getSelection();
				if ($isNodeSelection(selection)) {
					setIsSelected(selection.has(nodeKey));
				} else {
					setIsSelected(false);
				}

				// Read updated data from the node
				const node = $getNodeByKey(nodeKey);
				if (node && 'getData' in node) {
					const nodeData = (node as { getData: () => TData }).getData();
					setData(nodeData);
				}
			});
		});
	}, [editor, nodeKey]);

	const onChange = useCallback(
		(newData: Partial<TData>) => {
			editor.update(() => {
				const node = $getNodeByKey(nodeKey);
				if (node && 'setData' in node) {
					(node as { setData: (d: Partial<TData>) => void }).setData(newData);
				}
			});
		},
		[editor, nodeKey],
	);

	const theme = editor._config.theme;

	return (
		<Render
			data={data}
			onChange={onChange}
			isSelected={isSelected}
			nodeKey={nodeKey}
			theme={theme}
		/>
	);
}
