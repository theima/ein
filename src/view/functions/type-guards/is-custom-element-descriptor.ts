import { CustomElementDescriptor } from '../../types-and-interfaces/descriptors/custom.element-descriptor';
import { ElementDescriptor } from '../../types-and-interfaces/descriptors/element-descriptor';

export function isCustomElementDescriptor(descriptor: ElementDescriptor): descriptor is CustomElementDescriptor {
  const hasType = !!(descriptor as CustomElementDescriptor).type;
  if (hasType) {
    return true;
  }
  return !Array.isArray(descriptor.children);
}
