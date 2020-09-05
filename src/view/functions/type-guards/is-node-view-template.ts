import { NodeViewTemplate } from '../../types-and-interfaces/view-templates/node-view-template';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';

export function isNodeViewTemplate(viewTemplate: ViewTemplate): viewTemplate is NodeViewTemplate {
  return !!(viewTemplate as NodeViewTemplate).reducer;
}
