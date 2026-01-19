import type { ReactBlockDefinition } from '@inkblocks/react';
import { MessageCircle } from 'lucide-react';
import { INSERT_CALLOUT_COMMAND } from './CalloutPlugin';

export const calloutBlock: ReactBlockDefinition = {
	id: 'callout',
	title: 'Callout',
	icon: <MessageCircle size={18} />,
	keywords: ['callout', 'info', 'warning', 'note', 'alert'],
	category: 'advanced',
	insert: ({ editor }) => {
		editor.dispatchCommand(INSERT_CALLOUT_COMMAND, {
			calloutType: 'info',
			text: 'This is a callout block. Edit me!',
		});
	},
};
