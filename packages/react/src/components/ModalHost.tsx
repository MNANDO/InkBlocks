import type { JSX } from 'react';
import type { ModalState } from '../hooks/useModal';
import Modal from './Modal';

type Props = {
	modalState: ModalState | null;
	onClose: () => void;
};

export default function ModalHost({
	modalState,
	onClose,
}: Props): JSX.Element | null {
	if (modalState === null) return null;

	const { title, content, closeOnClickOutside } = modalState;

	return (
		<Modal
			title={title}
			onClose={onClose}
			closeOnClickOutside={closeOnClickOutside}
		>
			{content}
		</Modal>
	);
}
