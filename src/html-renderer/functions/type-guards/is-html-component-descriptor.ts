import { ExtenderDescriptor } from '../../types-and-interfaces/extender.descriptor';
import { HTMLComponentDescriptor } from '../../types-and-interfaces/html-component.descriptor';

export function isHtmlComponentDescriptor(desc: ExtenderDescriptor | HTMLComponentDescriptor): desc is HTMLComponentDescriptor {
  return !!(desc as HTMLComponentDescriptor).children;
}
