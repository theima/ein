import { DynamicAttribute, ViewEvent } from '..';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { Element } from '../types-and-interfaces/element';
import { Observable } from 'rxjs/Observable';
import { ModelToElementOrNull } from '../types-and-interfaces/model-to-element-or-null';
import { Attribute } from '../types-and-interfaces/attribute';

export function toElement(name: string,
                          attributes: Array<Attribute | DynamicAttribute>,
                          content: Array<ModelToElementOrNull | ModelToString>,
                          eventStream: Observable<ViewEvent> | null, model: object): Element {
    let element: Element = {
      name,
      attributes: attributes.map(a => {
        if (typeof a.value !== 'function') {
          return a as Attribute;
        }
        return {...a, value: a.value(model)};
      }),
      content: content.map(i => i(model)).filter(
        c => c !== null
      ) as any
    };
    if (eventStream) {
      element.eventStream = eventStream;
    }
    return element;
}
