import { CustomViewTemplate } from '../../types-and-interfaces/view-templates/custom.view-template';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';

export function isCustomElementTemplateDescriptor(descriptor: ViewTemplate): descriptor is CustomViewTemplate {
  const hasType = !!(descriptor as CustomViewTemplate).type;
  if (hasType) {
    return true;
  }
  return !Array.isArray(descriptor.children);
}
