import { Observable } from 'rxjs';
import { Element } from '../../types-and-interfaces/elements/element';
import { Attribute } from '../../types-and-interfaces/attribute';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { Action } from '../../../core';

export function createElement(name: string,
                              id: string,
                              attributes: Attribute[],
                              content: Array<Element | string>,
                              actionStream: Observable<Action> | null): StaticElement {

  let element: StaticElement = {
    name,
    id,
    attributes,
    content
  };
  if (actionStream) {
    element.actionStream = actionStream;
  }
  return element;
}
