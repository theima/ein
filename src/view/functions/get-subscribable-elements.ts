import { getElements } from './get-elements';
import { Element } from '../types-and-interfaces/element';

export function getSubscribableElements(content: Element[]): Element[] {
  return content.reduce(
    (datas: Element[], data: Element) => {
      let curr: Element[] = [data];
      if (data.content.length && !data.eventStream) {
        // at this point we differentiate between views and elements only if there is a stream,
        // we cant subscribe to children of a view.
        const templates: Element[] = getElements(data.content);
        curr = curr.concat(getSubscribableElements(templates));
      }
      return datas.concat(curr);
    }, []);
}
