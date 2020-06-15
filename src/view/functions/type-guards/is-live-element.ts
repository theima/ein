import { Element } from '../../types-and-interfaces/elements/element';
import { LiveElement } from '../../types-and-interfaces/elements/live.element';

export function isLiveElement(element: Element | undefined | Array<Element | string>): element is LiveElement {
  return !!element && !Array.isArray(element) &&  !!(element as LiveElement).elementStream;
}
