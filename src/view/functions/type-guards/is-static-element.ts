import { Element } from '../..';
import { LiveElement } from '../../types-and-interfaces/elements/live.element';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';

export function isStaticElement(element: Element | StaticElement | LiveElement | (StaticElement | LiveElement) | null | undefined): element is StaticElement {
  return !!element && !!(element as StaticElement).content;
}
