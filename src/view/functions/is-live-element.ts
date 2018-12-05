import { LiveElement } from '../types-and-interfaces/live-element';
import { Element } from '../types-and-interfaces/element';

export function isLiveElement(element: Element | null | undefined): element is LiveElement {
  return !!element && !!(element as LiveElement).childStream;
}
