import { NodeViewTemplate } from '../../types-and-interfaces/view-template/node-view-template';
import { ViewTemplate } from '../../types-and-interfaces/view-template/view-template';

export function isNodeViewTemplate(viewTemplate: ViewTemplate): viewTemplate is NodeViewTemplate {
  return !!(viewTemplate as NodeViewTemplate).reducer;
}
