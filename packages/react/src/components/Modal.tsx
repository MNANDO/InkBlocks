'use client';

import type { JSX, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { isDOMNode } from 'lexical';
import styles from './Modal.module.css';

type PortalImplProps = {
	children: ReactNode;
	closeOnClickOutside: boolean;
	onClose: () => void;
	title: string;
};

function PortalImpl({
	onClose,
	children,
	title,
	closeOnClickOutside,
}: PortalImplProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		modalRef.current?.focus();
	}, []);

	useEffect(() => {
		let overlayEl: HTMLElement | null = null;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
		};

		const onClickOutside = (event: MouseEvent) => {
			const target = event.target;
			if (
				closeOnClickOutside &&
				modalRef.current &&
				isDOMNode(target) &&
				!modalRef.current.contains(target)
			) {
				onClose();
			}
		};

		const modalEl = modalRef.current;
		if (modalEl) {
			overlayEl = modalEl.parentElement;
			overlayEl?.addEventListener('click', onClickOutside);
		}

		window.addEventListener('keydown', onKeyDown);

		return () => {
			window.removeEventListener('keydown', onKeyDown);
			overlayEl?.removeEventListener('click', onClickOutside);
		};
	}, [closeOnClickOutside, onClose]);

	return (
		<div className={styles.fixedOverlay} role="dialog" aria-modal="true">
			<div ref={modalRef} tabIndex={-1} className={styles.modal}>
				<div className={styles.header}>
					<h2 className={styles.title}>{title}</h2>

					<button
						type="button"
						aria-label="Close modal"
						onClick={onClose}
						className={styles.closeButton}
					>
						<span className={styles.closeIcon}>✕</span>
					</button>
				</div>

				<div className={styles.body}>{children}</div>
			</div>
		</div>
	);
}

type ModalProps = {
	children: ReactNode;
	closeOnClickOutside?: boolean;
	onClose: () => void;
	title: string;
};

export default function Modal({
	onClose,
	children,
	title,
	closeOnClickOutside = false,
}: ModalProps): JSX.Element {
	return createPortal(
		<PortalImpl
			onClose={onClose}
			title={title}
			closeOnClickOutside={closeOnClickOutside}
		>
			{children}
		</PortalImpl>,
		document.body
	);
}
