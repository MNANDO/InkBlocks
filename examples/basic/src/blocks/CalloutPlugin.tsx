import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
	$insertNodes,
	COMMAND_PRIORITY_EDITOR,
	createCommand,
	type LexicalCommand,
} from 'lexical';
import { $createCalloutNode, type CalloutType } from './CalloutNode';

export type InsertCalloutPayload = {
	calloutType: CalloutType;
	text: string;
};

export const INSERT_CALLOUT_COMMAND: LexicalCommand<InsertCalloutPayload> =
	createCommand('INSERT_CALLOUT_COMMAND');

export function CalloutPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return editor.registerCommand<InsertCalloutPayload>(
			INSERT_CALLOUT_COMMAND,
			(payload) => {
				editor.update(() => {
					const calloutNode = $createCalloutNode(
						payload.calloutType,
						payload.text,
					);
					$insertNodes([calloutNode]);
				});
				return true;
			},
			COMMAND_PRIORITY_EDITOR,
		);
	}, [editor]);

	return null;
}
