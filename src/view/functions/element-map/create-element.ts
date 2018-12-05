import { ViewEvent } from '../..';
import { Observable } from 'rxjs';
import { Element } from '../../types-and-interfaces/element';
import { Attribute } from '../../types-and-interfaces/attribute';

export function createElement(name: string,
                              attributes: Attribute[],
                              content: Array<Element | string>,
                              eventStream: Observable<ViewEvent> | null): Element {

  let element: Element = {
    name,
    id:'',
    attributes,
    content
  };
  if (eventStream) {
    element.eventStream = eventStream;
  }
  return element;
}
