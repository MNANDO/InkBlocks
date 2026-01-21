import './style.css';

// Components
export { default as InkBlocksEditorView } from './InkBlocksEditorView';
export { default as InkBlocksReactEditor } from './InkBlocksReactEditor';

// Hooks
export { useCreateInkBlocks } from './hooks/useCreateInkBlocks';

// Theme
export { default as defaultTheme } from './InkBlocksTheme';

// Types - Legacy (for block picker internals)
export type { ReactBlockDefinition, BlockCategory } from './types';

// Types - New Block API
export type { ReactBlockConfig, BlockRenderProps } from './api/types';
export type { UseCreateInkBlocksOptions } from './hooks/useCreateInkBlocks';
export type { InkBlocksReactEditorOptions } from './InkBlocksReactEditor';
export type { InkBlocksEditorViewProps } from './InkBlocksEditorView';
