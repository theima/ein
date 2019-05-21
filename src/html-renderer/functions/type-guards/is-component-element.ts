import { ComponentElement } from '../../types-and-interfaces/component.element';
import { Element } from '../../../view';

export function isComponentElement(element: Element | null | undefined | Array<Element | string>): element is ComponentElement {
  return !!element && !Array.isArray(element) &&  !!(element as ComponentElement).willBeDestroyed;
}
