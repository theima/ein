import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams, DynamicAttribute } from '../../view';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';
import { Attribute } from '../../view/types-and-interfaces/attribute';

export function view(name: string,
                     template: string,
                     events?: (subscribe: EventStreams) => Observable<ViewEvent>): HtmlElementData {
  const getModelAttribute = (attributes: Array<Attribute | DynamicAttribute>) => {
    return attributes
      .find(a => a.name === BuiltIn.ModelAttr);
  };
  const templateValidator = (attributes: Array<Attribute | DynamicAttribute>) => {
    const attr = getModelAttribute(attributes);
    return !attr || (typeof attr.value === 'string');
  };
  const result: HtmlElementData = {
    name,
    content: template,
    templateValidator
  };
  if (events) {
    result.events = events;
  }
  return result;
}
