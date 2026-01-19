import type { JSX } from 'react';
import { useCallback, useState } from 'react';

export type ModalState = {
	closeOnClickOutside: boolean;
	content: JSX.Element;
	title: string;
};

export type ShowModal = (
	title: string,
	getContent: (onClose: () => void) => JSX.Element,
	closeOnClickOutside?: boolean
) => void;

export default function useModal(): {
	modalState: ModalState | null;
	showModal: ShowModal;
	closeModal: () => void;
} {
	const [modalState, setModalState] = useState<ModalState | null>(null);

	const closeModal = useCallback(() => {
		setModalState(null);
	}, []);

	const showModal = useCallback<ShowModal>(
		(title, getContent, closeOnClickOutside = false) => {
			setModalState({
				closeOnClickOutside,
				content: getContent(closeModal),
				title,
			});
		},
		[closeModal]
	);

	return { modalState, showModal, closeModal };
}
