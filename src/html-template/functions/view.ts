import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams, DynamicAttribute } from '../../view';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { getModel } from './get-model';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';
import { Attribute } from '../../view/types-and-interfaces/attribute';

export function view(name: string,
                     template: string,
                     events?: (subscribe: EventStreams) => Observable<ViewEvent>): HtmlElementData {
  const getModelAttribute = (attributes: Array<Attribute | DynamicAttribute>) => {
    return attributes
      .find(a => a.name === BuiltIn.Model);
  };
  const templateValidator = (attributes: Array<Attribute | DynamicAttribute>) => {
    const attr = getModelAttribute(attributes);
    return !attr || (typeof attr.value === 'string');
  };
  const result: HtmlElementData = {
    name,
    content: template,
    templateValidator,
    createModelMap: (attributes: Array<Attribute | DynamicAttribute>) => {
      const attr = getModelAttribute(attributes);
      if (attr && templateValidator(attributes)) {
        const keys = attr ? attr.value + '' : '';
        return m => getModel(m, keys);
      }
      return m => m;
    }
  };
  if (events) {
    result.events = events;
  }
  return result;
}
