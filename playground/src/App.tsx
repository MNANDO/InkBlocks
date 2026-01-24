import { InkBlocksEditorView, useCreateInkBlocks } from '@inkblocks/react';
import type { ReactBlockConfig } from '@inkblocks/react';
import { MessageCircle, Image } from 'lucide-react';
import { useRef } from 'react';
import { calloutBlock, type CalloutData, type CalloutType } from './blocks/callout';
import { imageBlock, type ImageData } from './blocks/image';

const styles: Record<CalloutType, { bg: string; border: string; icon: string }> = {
	info: { bg: '#e7f3ff', border: '#2196f3', icon: 'ℹ️' },
	warning: { bg: '#fff3e0', border: '#ff9800', icon: '⚠️' },
	success: { bg: '#e8f5e9', border: '#4caf50', icon: '✅' },
	error: { bg: '#ffebee', border: '#f44336', icon: '❌' },
};

function ImageBlockRenderer({
	data,
	onChange,
	isSelected,
}: {
	data: ImageData;
	onChange: (newData: Partial<ImageData>) => void;
	isSelected: boolean;
}) {
	const containerRef = useRef<HTMLDivElement>(null);

	const handleResizeStart = (e: React.MouseEvent, side: 'left' | 'right') => {
		e.preventDefault();
		e.stopPropagation();

		const container = containerRef.current;
		if (!container) return;

		const containerWidth = container.offsetWidth;
		const startX = e.clientX;
		const startWidth = data.width;

		const handleMouseMove = (moveEvent: MouseEvent) => {
			const deltaX = moveEvent.clientX - startX;
			const deltaPercent = (deltaX / containerWidth) * 100;

			let newWidth: number;
			if (side === 'right') {
				newWidth = startWidth + deltaPercent;
			} else {
				newWidth = startWidth - deltaPercent;
			}

			newWidth = Math.max(10, Math.min(100, newWidth));
			onChange({ width: Math.round(newWidth) });
		};

		const handleMouseUp = () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const resizeHandleStyle: React.CSSProperties = {
		position: 'absolute',
		top: '50%',
		transform: 'translateY(-50%)',
		width: '12px',
		height: '48px',
		backgroundColor: '#2196f3',
		borderRadius: '4px',
		cursor: 'ew-resize',
		zIndex: 10,
	};

	return (
		<div ref={containerRef}>
			<figure
				style={{
					margin: '8px 0',
					padding: '8px 20px',
					borderRadius: '4px',
					outline: isSelected ? '2px solid #2196f3' : '1px dashed #ccc',
					textAlign: 'center',
					overflow: 'visible',
				}}
			>
				{data.src ? (
					<div
						style={{
							position: 'relative',
							display: 'inline-block',
							width: `${data.width}%`,
							overflow: 'visible',
						}}
					>
						<img
							src={data.src}
							alt={data.alt}
							style={{
								width: '100%',
								borderRadius: '4px',
								display: 'block',
							}}
						/>
						{isSelected && (
							<>
								<div
									style={{ ...resizeHandleStyle, left: '-16px' }}
									onMouseDown={(e) => handleResizeStart(e, 'left')}
									title="Drag to resize"
								/>
								<div
									style={{ ...resizeHandleStyle, right: '-16px' }}
									onMouseDown={(e) => handleResizeStart(e, 'right')}
									title="Drag to resize"
								/>
							</>
						)}
					</div>
				) : (
					<div
						style={{
							padding: '32px',
							backgroundColor: '#f5f5f5',
							borderRadius: '4px',
							color: '#666',
						}}
					>
						<Image size={48} style={{ marginBottom: '8px', opacity: 0.5 }} />
						<div>Add an image URL below</div>
					</div>
				)}
				<div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<input
						type="url"
						placeholder="Image URL"
						value={data.src}
						onChange={(e) => onChange({ src: e.target.value })}
						style={{
							width: '100%',
							padding: '8px',
							border: '1px solid #ccc',
							borderRadius: '4px',
						}}
					/>
					<input
						type="text"
						placeholder="Alt text"
						value={data.alt}
						onChange={(e) => onChange({ alt: e.target.value })}
						style={{
							width: '100%',
							padding: '8px',
							border: '1px solid #ccc',
							borderRadius: '4px',
						}}
					/>
					<input
						type="text"
						placeholder="Caption (optional)"
						value={data.caption}
						onChange={(e) => onChange({ caption: e.target.value })}
						style={{
							width: '100%',
							padding: '8px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							fontStyle: 'italic',
						}}
					/>
				</div>
				{data.caption && (
					<figcaption style={{ marginTop: '8px', color: '#666', fontStyle: 'italic' }}>
						{data.caption}
					</figcaption>
				)}
			</figure>
		</div>
	);
}

const imageReactBlock: ReactBlockConfig<ImageData> = {
	block: imageBlock,
	title: 'Image',
	icon: <Image size={18} />,
	keywords: ['image', 'picture', 'photo', 'img'],
	category: 'advanced',
	render: (props) => <ImageBlockRenderer {...props} />,
};

const calloutReactBlock: ReactBlockConfig<CalloutData> = {
	block: calloutBlock,
	title: 'Callout',
	icon: <MessageCircle size={18} />,
	keywords: ['callout', 'info', 'warning', 'note', 'alert'],
	category: 'advanced',
	render: ({ data, onChange, isSelected, theme }) => {
		const style = styles[data.calloutType];
		const calloutTheme = theme.callout as Record<string, string> | undefined;

		return (
			<div
				className={calloutTheme?.[data.calloutType]}
				style={{
					backgroundColor: style.bg,
					borderLeft: `4px solid ${style.border}`,
					padding: '12px 16px',
					margin: '8px 0',
					borderRadius: '4px',
					display: 'flex',
					alignItems: 'flex-start',
					gap: '8px',
					outline: isSelected ? '2px solid #2196f3' : 'none',
				}}
			>
				<span style={{ fontSize: '18px' }}>{style.icon}</span>
				<div style={{ flex: 1 }}>
					<select
						value={data.calloutType}
						onChange={(e) => onChange({ calloutType: e.target.value as CalloutType })}
						style={{
							marginBottom: '8px',
							padding: '4px 8px',
							borderRadius: '4px',
							border: '1px solid #ccc',
						}}
					>
						<option value="info">Info</option>
						<option value="warning">Warning</option>
						<option value="success">Success</option>
						<option value="error">Error</option>
					</select>
					<input
						value={data.text}
						onChange={(e) => onChange({ text: e.target.value })}
						style={{
							width: '100%',
							padding: '8px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							background: 'transparent',
						}}
					/>
				</div>
			</div>
		);
	},
};

function App() {
	const editor = useCreateInkBlocks({
		blocks: [imageReactBlock, calloutReactBlock],
		theme: {
			callout: {
				info: 'custom-callout-info',
				warning: 'custom-callout-warning',
				success: 'custom-callout-success',
				error: 'custom-callout-error',
			},
		},
	});

	return (
		<div>
			<InkBlocksEditorView editor={editor} className="mx-auto" />
		</div>
	);
}

export default App;
