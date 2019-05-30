import { CustomElementDescriptor } from '../../types-and-interfaces/descriptors/custom.element-template-descriptor';
import { ElementTemplateDescriptor } from '../../types-and-interfaces/descriptors/element-template-descriptor';

export function isCustomElementTemplateDescriptor(descriptor: ElementTemplateDescriptor): descriptor is CustomElementDescriptor {
  const hasType = !!(descriptor as CustomElementDescriptor).type;
  if (hasType) {
    return true;
  }
  return !Array.isArray(descriptor.children);
}
