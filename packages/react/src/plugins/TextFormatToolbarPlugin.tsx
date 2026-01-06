import type { JSX } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
	$getSelection,
	$isParagraphNode,
	$isRangeSelection,
	$isTextNode,
	COMMAND_PRIORITY_LOW,
	FORMAT_TEXT_COMMAND,
	getDOMSelection,
	LexicalEditor,
	SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
	Bold,
	Italic,
	Underline,
	Strikethrough,
	Subscript,
	Superscript,
	CaseUpper,
	CaseLower,
	CaseSensitive,
} from 'lucide-react';

import {
	getDOMRangeRect,
	getSelectedNode,
	setFloatingElemPosition,
} from '../utils';

type ToolbarButtonProps = {
	active?: boolean;
	spaced?: boolean;
	title: string;
	ariaLabel: string;
	onClick: () => void;
	children: JSX.Element;
};

function ToolbarButton({
	active,
	spaced,
	title,
	ariaLabel,
	onClick,
	children,
}: ToolbarButtonProps): JSX.Element {
	return (
		<button
			type="button"
			onClick={onClick}
			title={title}
			aria-label={ariaLabel}
			className={[
				'inline-flex items-center rounded-[10px] bg-transparent p-2 align-middle',
				spaced ? 'mr-0.5' : '',
				'cursor-pointer hover:bg-[#eee]',
				active ? 'bg-[rgba(223,232,250,0.3)]' : '',
			]
				.filter(Boolean)
				.join(' ')}
		>
			<span
				className={[
					'inline-flex h-4.5 w-4.5 items-center justify-center',
					active ? 'opacity-100' : 'opacity-60',
				].join(' ')}
			>
				{children}
			</span>
		</button>
	);
}

function TextFormatFloatingToolbar({
	editor,
	anchorElem,
	isBold,
	isItalic,
	isUnderline,
	isUppercase,
	isLowercase,
	isCapitalize,
	isStrikethrough,
	isSubscript,
	isSuperscript,
}: {
	editor: LexicalEditor;
	anchorElem: HTMLElement;
	isBold: boolean;
	isItalic: boolean;
	isUnderline: boolean;
	isUppercase: boolean;
	isLowercase: boolean;
	isCapitalize: boolean;
	isStrikethrough: boolean;
	isSubscript: boolean;
	isSuperscript: boolean;
}): JSX.Element {
	const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

	function mouseMoveListener(e: MouseEvent) {
		if (
			popupCharStylesEditorRef.current &&
			(e.buttons === 1 || e.buttons === 3)
		) {
			if (
				popupCharStylesEditorRef.current.style.pointerEvents !== 'none'
			) {
				const elementUnderMouse = document.elementFromPoint(
					e.clientX,
					e.clientY
				);
				if (
					elementUnderMouse &&
					!popupCharStylesEditorRef.current.contains(
						elementUnderMouse
					)
				) {
					popupCharStylesEditorRef.current.style.pointerEvents =
						'none';
				}
			}
		}
	}

	function mouseUpListener() {
		if (!popupCharStylesEditorRef.current) return;
		if (popupCharStylesEditorRef.current.style.pointerEvents !== 'auto') {
			popupCharStylesEditorRef.current.style.pointerEvents = 'auto';
		}
	}

	useEffect(() => {
		if (!popupCharStylesEditorRef.current) return;

		document.addEventListener('mousemove', mouseMoveListener);
		document.addEventListener('mouseup', mouseUpListener);

		return () => {
			document.removeEventListener('mousemove', mouseMoveListener);
			document.removeEventListener('mouseup', mouseUpListener);
		};
	}, []);

	const $updateTextFormatFloatingToolbar = useCallback(() => {
		const selection = $getSelection();
		const popupElem = popupCharStylesEditorRef.current;
		const nativeSelection = getDOMSelection(editor._window);

		if (popupElem === null) return;

		const rootElement = editor.getRootElement();
		if (
			selection !== null &&
			nativeSelection !== null &&
			!nativeSelection.isCollapsed &&
			rootElement !== null &&
			rootElement.contains(nativeSelection.anchorNode)
		) {
			const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
			setFloatingElemPosition(rangeRect, popupElem, anchorElem, false);
		}
	}, [editor, anchorElem]);

	useEffect(() => {
		const scrollerElem = anchorElem.parentElement;

		const update = () => {
			editor.getEditorState().read(() => {
				$updateTextFormatFloatingToolbar();
			});
		};

		window.addEventListener('resize', update);
		scrollerElem?.addEventListener('scroll', update);

		return () => {
			window.removeEventListener('resize', update);
			scrollerElem?.removeEventListener('scroll', update);
		};
	}, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

	useEffect(() => {
		editor.getEditorState().read(() => {
			$updateTextFormatFloatingToolbar();
		});

		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					$updateTextFormatFloatingToolbar();
				});
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					$updateTextFormatFloatingToolbar();
					return false;
				},
				COMMAND_PRIORITY_LOW
			)
		);
	}, [editor, $updateTextFormatFloatingToolbar]);

	return (
		<div
			ref={popupCharStylesEditorRef}
			className={[
				'absolute left-0 top-0 z-10 flex h-8.75 items-center',
				'rounded-lg bg-white p-1 shadow-[0px_5px_10px_rgba(0,0,0,0.3)]',
				'opacity-0 transition-opacity duration-500 will-change-transform',
			].join(' ')}
		>
			{editor.isEditable() && (
				<>
					<ToolbarButton
						spaced
						active={isBold}
						title="Bold"
						ariaLabel="Format text as bold"
						onClick={() =>
							editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
						}
					>
						<Bold className="h-4.5 w-4.5" />
					</ToolbarButton>

					<ToolbarButton
						spaced
						active={isItalic}
						title="Italic"
						ariaLabel="Format text as italics"
						onClick={() =>
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'italic'
							)
						}
					>
						<Italic className="h-4.5 w-4.5" />
					</ToolbarButton>

					<ToolbarButton
						spaced
						active={isUnderline}
						title="Underline"
						ariaLabel="Format text to underlined"
						onClick={() =>
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'underline'
							)
						}
					>
						<Underline className="h-4.5 w-4.5" />
					</ToolbarButton>

					<ToolbarButton
						spaced
						active={isStrikethrough}
						title="Strikethrough"
						ariaLabel="Format text with a strikethrough"
						onClick={() =>
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'strikethrough'
							)
						}
					>
						<Strikethrough className="h-4.5 w-4.5" />
					</ToolbarButton>

					<ToolbarButton
						spaced
						active={isSubscript}
						title="Subscript"
						ariaLabel="Format Subscript"
						onClick={() =>
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'subscript'
							)
						}
					>
						<Subscript className="h-4.5 w-4.5" />
					</ToolbarButton>

					<ToolbarButton
						spaced
						active={isSuperscript}
						title="Superscript"
						ariaLabel="Format Superscript"
						onClick={() =>
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'superscript'
							)
						}
					>
						<Superscript className="h-4.5 w-4.5" />
					</ToolbarButton>

					<ToolbarButton
						spaced
						active={isUppercase}
						title="Uppercase"
						ariaLabel="Format text to uppercase"
						onClick={() =>
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'uppercase'
							)
						}
					>
						<CaseUpper className="h-4.5 w-4.5" />
					</ToolbarButton>

					<ToolbarButton
						spaced
						active={isLowercase}
						title="Lowercase"
						ariaLabel="Format text to lowercase"
						onClick={() =>
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'lowercase'
							)
						}
					>
						<CaseLower className="h-4.5 w-4.5" />
					</ToolbarButton>

					<ToolbarButton
						spaced
						active={isCapitalize}
						title="Capitalize"
						ariaLabel="Format text to capitalize"
						onClick={() =>
							editor.dispatchCommand(
								FORMAT_TEXT_COMMAND,
								'capitalize'
							)
						}
					>
						<CaseSensitive className="h-4.5 w-4.5" />
					</ToolbarButton>
				</>
			)}
		</div>
	);
}

function useFloatingTextFormatToolbar(
	editor: LexicalEditor,
	anchorElem: HTMLElement
): JSX.Element | null {
	const [isText, setIsText] = useState(false);

	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isUppercase, setIsUppercase] = useState(false);
	const [isLowercase, setIsLowercase] = useState(false);
	const [isCapitalize, setIsCapitalize] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	const [isSubscript, setIsSubscript] = useState(false);
	const [isSuperscript, setIsSuperscript] = useState(false);

	const updatePopup = useCallback(() => {
		editor.getEditorState().read(() => {
			// Do not pop up the floating toolbar when using IME input
			if (editor.isComposing()) return;

			const selection = $getSelection();
			const nativeSelection = getDOMSelection(editor._window);
			const rootElement = editor.getRootElement();

			if (
				nativeSelection !== null &&
				(!$isRangeSelection(selection) ||
					rootElement === null ||
					!rootElement.contains(nativeSelection.anchorNode))
			) {
				setIsText(false);
				return;
			}

			if (!$isRangeSelection(selection)) return;

			const node = getSelectedNode(selection);

			setIsBold(selection.hasFormat('bold'));
			setIsItalic(selection.hasFormat('italic'));
			setIsUnderline(selection.hasFormat('underline'));
			setIsUppercase(selection.hasFormat('uppercase'));
			setIsLowercase(selection.hasFormat('lowercase'));
			setIsCapitalize(selection.hasFormat('capitalize'));
			setIsStrikethrough(selection.hasFormat('strikethrough'));
			setIsSubscript(selection.hasFormat('subscript'));
			setIsSuperscript(selection.hasFormat('superscript'));

			if (selection.getTextContent() !== '') {
				setIsText($isTextNode(node) || $isParagraphNode(node));
			} else {
				setIsText(false);
			}

			const rawTextContent = selection
				.getTextContent()
				.replace(/\n/g, '');
			if (!selection.isCollapsed() && rawTextContent === '') {
				setIsText(false);
			}
		});
	}, [editor]);

	useEffect(() => {
		document.addEventListener('selectionchange', updatePopup);
		return () => {
			document.removeEventListener('selectionchange', updatePopup);
		};
	}, [updatePopup]);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(() => updatePopup()),
			editor.registerRootListener(() => {
				if (editor.getRootElement() === null) {
					setIsText(false);
				}
			})
		);
	}, [editor, updatePopup]);

	if (!isText) return null;

	return createPortal(
		<TextFormatFloatingToolbar
			editor={editor}
			anchorElem={anchorElem}
			isBold={isBold}
			isItalic={isItalic}
			isUnderline={isUnderline}
			isUppercase={isUppercase}
			isLowercase={isLowercase}
			isCapitalize={isCapitalize}
			isStrikethrough={isStrikethrough}
			isSubscript={isSubscript}
			isSuperscript={isSuperscript}
		/>,
		anchorElem
	);
}

export default function TextFormatToolbarPlugin({
	anchorElem = document.body,
}: {
	anchorElem?: HTMLElement;
}): JSX.Element | null {
	const [editor] = useLexicalComposerContext();
	return useFloatingTextFormatToolbar(editor, anchorElem);
}
