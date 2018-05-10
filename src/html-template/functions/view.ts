import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams, Attribute } from '../../view';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { getModel } from './get-model';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';
import { ModelToAttribute } from '../../view/types-and-interfaces/model-to-attribute';

export function view(name: string,
                     template: string,
                     events?: (subscribe: EventStreams) => Observable<ViewEvent>): HtmlElementData {
  const getModelAttribute = (attributes: Array<Attribute | ModelToAttribute>) => {
    return attributes
      .find(a => a.name === BuiltIn.Model) as Attribute | undefined;
  };

  const result: HtmlElementData = {
    name,
    content: template,
    templateValidator: (attributes: Array<Attribute | ModelToAttribute>) => {
      const attr = getModelAttribute(attributes);
      return !attr || (typeof attr.value === 'string');
    },
    createModelMap: (attributes: Array<Attribute | ModelToAttribute>) => {
      const attr = getModelAttribute(attributes);
      if (attr) {
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
