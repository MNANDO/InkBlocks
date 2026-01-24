import { createEditor, Klass, LexicalNode } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { InkBlocksBaseNodes } from './nodes/InkBlocksBaseNodes';

/**
 * Creates a headless Lexical editor for HTML serialization.
 * Use this when you need to render editor content as static HTML
 * without mounting the full editor UI.
 *
 * @param customNodes - Custom Lexical nodes to register (must implement exportDOM)
 * @returns A headless Lexical editor instance
 *
 * @example
 * ```ts
 * import { createHeadlessEditor } from '@inkblocks/core'
 * import { ImageNode } from './nodes/ImageNode'
 *
 * const editor = createHeadlessEditor([ImageNode])
 * const state = editor.parseEditorState(savedJSON)
 * ```
 */
export function createHeadlessEditor(
	customNodes: Array<Klass<LexicalNode>> = [],
) {
	return createEditor({
		nodes: [...InkBlocksBaseNodes, ...customNodes],
		onError: (error) => {
			console.error('InkBlocks headless editor error:', error);
		},
	});
}

/**
 * Converts saved editor state JSON to HTML string.
 * Custom nodes must implement exportDOM() for proper HTML output.
 *
 * @param json - Serialized EditorState JSON string
 * @param customNodes - Custom Lexical nodes to register (must implement exportDOM)
 * @returns HTML string representation of the editor content
 *
 * @example
 * ```ts
 * import { serializeToHTML } from '@inkblocks/core'
 * import { ImageNode } from './nodes/ImageNode'
 *
 * // On a display page (no editor mounted)
 * const html = serializeToHTML(savedJSON, [ImageNode])
 *
 * // Use in React
 * return <div dangerouslySetInnerHTML={{ __html: html }} />
 *
 * // Use server-side
 * return `<article>${html}</article>`
 * ```
 */
export function serializeToHTML(
	json: string,
	customNodes: Array<Klass<LexicalNode>> = [],
): string {
	const editor = createHeadlessEditor(customNodes);
	const editorState = editor.parseEditorState(json);

	let html = '';
	editorState.read(() => {
		html = $generateHtmlFromNodes(editor);
	});

	return html;
}
