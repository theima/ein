import { ModelToElement, ViewEvent } from '..';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { ModelToAttribute } from '../types-and-interfaces/model-to-attribute';
import { Element } from '../types-and-interfaces/element';
import { Observable } from 'rxjs/Observable';
import { ModelToElementOrNull } from '../types-and-interfaces/model-to-element-or-null';

export function toViewMap(name: string,
                          attributes: ModelToAttribute[],
                          content: Array<ModelToElementOrNull | ModelToString>,
                          eventStream?: Observable<ViewEvent>): ModelToElement {
  return (m: object) => {
    let element: Element = {
      name,
      attributes: attributes.map(pm => pm(m)),
      content: content.map(i => i(m)).filter(
        c => c !== null
      ) as any
    };
    if (eventStream) {
      element.eventStream = eventStream;
    }
    return element;
  };
}
