import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams } from '../../view';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { getModel } from './get-model';
import { TemplateAttribute } from '../';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';

export function view(name: string,
                     template: string,
                     events?: (subscribe: EventStreams) => Observable<ViewEvent>): HtmlElementData {
  const getModelAttribute = (attributes: TemplateAttribute[]) => {
    return attributes
      .find(a => a.name === BuiltIn.Model);
  };

  const result: HtmlElementData = {
    name,
    content: template,
    templateValidator: (attributes: TemplateAttribute[]) => {
      const attr = getModelAttribute(attributes);
      if (attr && attr.value.indexOf('{{') !== -1) {
        return false;
      }
      return !attr || (typeof attr.value === 'string');
    },
    createModelMap: (attributes: TemplateAttribute[]) => {
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
