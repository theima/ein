import { Element } from '../..';
import { StaticElement } from '../../types-and-interfaces/elements/static-element';

export function isStaticElement(element: Element | null | undefined): element is StaticElement {
  return !!element && !!(element as StaticElement).content;
}
