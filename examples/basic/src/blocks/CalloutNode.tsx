import {
	DecoratorNode,
	type DOMExportOutput,
	type LexicalNode,
	type NodeKey,
	type SerializedLexicalNode,
	type Spread,
} from 'lexical';
import type { ReactNode } from 'react';
import { CalloutComponent } from '../CalloutComponent';

export type CalloutType = 'info' | 'warning' | 'success' | 'error';

export type SerializedCalloutNode = Spread<
	{
		calloutType: CalloutType;
		text: string;
	},
	SerializedLexicalNode
>;

export class CalloutNode extends DecoratorNode<ReactNode> {
	__calloutType: CalloutType;
	__text: string;

	static getType(): string {
		return 'callout';
	}

	static clone(node: CalloutNode): CalloutNode {
		return new CalloutNode(node.__calloutType, node.__text, node.__key);
	}

	constructor(calloutType: CalloutType, text: string, key?: NodeKey) {
		super(key);
		this.__calloutType = calloutType;
		this.__text = text;
	}

	createDOM(): HTMLElement {
		const div = document.createElement('div');
		return div;
	}

	updateDOM(): false {
		return false;
	}

	// For HTML export (copy/paste, serializeToHTML)
	exportDOM(): DOMExportOutput {
		const element = document.createElement('div');
		element.className = `callout callout-${this.__calloutType}`;
		element.setAttribute('data-callout-type', this.__calloutType);
		element.textContent = this.__text;
		return { element };
	}

	// For JSON serialization (saving to database)
	exportJSON(): SerializedCalloutNode {
		return {
			type: 'callout',
			calloutType: this.__calloutType,
			text: this.__text,
			version: 1,
		};
	}

	static importJSON(serializedNode: SerializedCalloutNode): CalloutNode {
		return new CalloutNode(serializedNode.calloutType, serializedNode.text);
	}

	decorate(): ReactNode {
		return (
			<CalloutComponent
				calloutType={this.__calloutType}
				text={this.__text}
			/>
		);
	}
}

export function $createCalloutNode(
	calloutType: CalloutType,
	text: string,
): CalloutNode {
	return new CalloutNode(calloutType, text);
}

export function $isCalloutNode(
	node: LexicalNode | null | undefined,
): node is CalloutNode {
	return node instanceof CalloutNode;
}
