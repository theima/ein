
import { Element } from '../../types-and-interfaces/elements/element';
import { ComponentElement } from '../../types-and-interfaces/elements/component.element';

export function isComponentElement(element: Element | null | undefined | Array<Element | string>): element is ComponentElement {
  return !!element && !Array.isArray(element) &&  !!(element as ComponentElement).willBeDestroyed;
}
