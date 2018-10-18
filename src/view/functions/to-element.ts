import { DynamicAttribute, ModelMap, ViewEvent } from '..';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { Element } from '../types-and-interfaces/element';
import { Observable } from 'rxjs';
import { ModelToElementOrNull } from '../types-and-interfaces/model-to-element-or-null';
import { Attribute } from '../types-and-interfaces/attribute';
import { ModelToElements } from '../types-and-interfaces/model-to-elements';
import { NativeElementLookup } from '../types-and-interfaces/native-element-lookup';

export function toElement(name: string,
                          attributes: Array<Attribute | DynamicAttribute>,
                          content: Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                          eventStream: Observable<ViewEvent> | null,
                          lookUp: NativeElementLookup | null,
                          model: object,
                          map: ModelMap): Element {

  const mappedContent = content.map(i => i(map(model))).reduce(
    (all: Array<string | Element>, item: string | Element | Element[] | null) => {
      if (item !== null) {
        if (Array.isArray(item)) {
          all = all.concat(item);
        } else {
          all.push(item);
        }
      }
      return all;
    }, []);
  let element: Element = {
    name,
    attributes: attributes.map(a => {
      if (typeof a.value !== 'function') {
        return a as Attribute;
      }
      return {...a, value: a.value(model)};
    }),
    content: mappedContent
  };
  if (eventStream) {
    element.eventStream = eventStream;
  }
  if (lookUp) {
    element.setElementLookup = lookUp;
  }
  return element;
}
