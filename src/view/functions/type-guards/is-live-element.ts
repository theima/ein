import { LiveElement } from '../../types-and-interfaces/elements/live.element';
import { Element } from '../../types-and-interfaces/elements/element';

export function isLiveElement(element: Element | null | undefined | Array<Element | string>): element is LiveElement {
  return !!element && !Array.isArray(element) &&  !!(element as LiveElement).childStream;
}
