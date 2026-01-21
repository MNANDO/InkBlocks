import { InkBlocksEditorView, useCreateInkBlocks } from '@inkblocks/react';
import type { ReactBlockConfig } from '@inkblocks/react';
import { MessageCircle, Image } from 'lucide-react';
import { calloutBlock, type CalloutData, type CalloutType } from './blocks/callout';
import { imageBlock, type ImageData } from './blocks/image';

const styles: Record<CalloutType, { bg: string; border: string; icon: string }> = {
	info: { bg: '#e7f3ff', border: '#2196f3', icon: 'ℹ️' },
	warning: { bg: '#fff3e0', border: '#ff9800', icon: '⚠️' },
	success: { bg: '#e8f5e9', border: '#4caf50', icon: '✅' },
	error: { bg: '#ffebee', border: '#f44336', icon: '❌' },
};

const imageReactBlock: ReactBlockConfig<ImageData> = {
	block: imageBlock,
	title: 'Image',
	icon: <Image size={18} />,
	keywords: ['image', 'picture', 'photo', 'img'],
	category: 'advanced',
	render: ({ data, onChange, isSelected }) => {
		return (
			<figure
				style={{
					margin: '8px 0',
					padding: '8px',
					borderRadius: '4px',
					outline: isSelected ? '2px solid #2196f3' : '1px dashed #ccc',
					textAlign: 'center',
				}}
			>
				{data.src ? (
					<img
						src={data.src}
						alt={data.alt}
						style={{
							maxWidth: '100%',
							borderRadius: '4px',
						}}
					/>
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
		);
	},
};

const calloutReactBlock: ReactBlockConfig<CalloutData> = {
	block: calloutBlock,
	title: 'Callout',
	icon: <MessageCircle size={18} />,
	keywords: ['callout', 'info', 'warning', 'note', 'alert'],
	category: 'advanced',
	render: ({ data, onChange, isSelected }) => {
		const style = styles[data.calloutType];

		return (
			<div
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
	});

	return (
		<div>
			<InkBlocksEditorView editor={editor} className="mx-auto" />
		</div>
	);
}

export default App;
