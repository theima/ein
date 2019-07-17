import { ExtenderDescriptor } from '../../types-and-interfaces/extender.descriptor';
import { ComponentDescriptor } from '../../types-and-interfaces/component.descriptor';

export function isComponentDescriptor(desc: ExtenderDescriptor | ComponentDescriptor): desc is ComponentDescriptor {
  return !!(desc as ComponentDescriptor).children;
}
