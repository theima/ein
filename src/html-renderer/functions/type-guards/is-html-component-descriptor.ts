import { ExtenderDescriptor } from '../../types-and-interfaces/extender.descriptor';
import { ComponentDescriptor } from '../../types-and-interfaces/component.descriptor';
import { HTMLComponentDescriptor } from '../../types-and-interfaces/html-component.descriptor';
import { isArray } from 'rxjs/internal/util/isArray';

export function isHtmlComponentDescriptor(desc: ExtenderDescriptor | ComponentDescriptor | HTMLComponentDescriptor): desc is HTMLComponentDescriptor {
  return !!(desc as ComponentDescriptor).children && isArray((desc as ComponentDescriptor).children);
}
