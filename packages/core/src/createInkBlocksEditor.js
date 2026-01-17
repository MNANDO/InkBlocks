import { buildEditorFromExtensions } from '@lexical/extension';
import { InkBlocksCoreExtension } from './InkBlocksCoreExtension';
export const createInkBlocksEditor = buildEditorFromExtensions(InkBlocksCoreExtension);
