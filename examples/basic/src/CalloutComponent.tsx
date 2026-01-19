import type { CalloutType } from './blocks/CalloutNode';

export function CalloutComponent({
	calloutType,
	text,
}: {
	calloutType: CalloutType;
	text: string;
}) {
	const styles: Record<
		CalloutType,
		{ bg: string; border: string; icon: string }
	> = {
		info: { bg: '#e7f3ff', border: '#2196f3', icon: 'ℹ️' },
		warning: { bg: '#fff3e0', border: '#ff9800', icon: '⚠️' },
		success: { bg: '#e8f5e9', border: '#4caf50', icon: '✅' },
		error: { bg: '#ffebee', border: '#f44336', icon: '❌' },
	};

	const style = styles[calloutType];

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
			}}
		>
			<span style={{ fontSize: '18px' }}>{style.icon}</span>
			<span>{text}</span>
		</div>
	);
}
