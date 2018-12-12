import { ViewEvent } from '../..';
import { Observable } from 'rxjs';
import { Element } from '../../types-and-interfaces/elements/element';
import { Attribute } from '../../types-and-interfaces/attribute';
import { StaticElement } from '../../types-and-interfaces/elements/static-element';

export function createElement(name: string,
                              id: string,
                              attributes: Attribute[],
                              content: Array<Element | string>,
                              eventStream: Observable<ViewEvent> | null): StaticElement {

  let element: StaticElement = {
    name,
    id,
    attributes,
    content
  };
  if (eventStream) {
    element.eventStream = eventStream;
  }
  return element;
}
