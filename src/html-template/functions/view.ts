import { TemplateElement } from '../types-and-interfaces/template-element';
import { ViewData } from '../types-and-interfaces/view-data';
import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams } from '../../view';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { getModel } from './get-model';
import { Attribute, HTMLParser } from '../';

export function view(name: string,
                     template: string,
                     events?: (subscribe: EventStreams) => Observable<ViewEvent>): ViewData;
export function view(name: string,
                     content: Array<TemplateElement | string>,
                     events?: (subscribe: EventStreams) => Observable<ViewEvent>): ViewData;
export function view(name: string,
                     content: Array<TemplateElement | string> | string,
                     events?: (subscribe: EventStreams) => Observable<ViewEvent>): ViewData {
  const getModelAttribute = (attributes: Attribute[]) => {
    return attributes
      .find(a => a.name === BuiltIn.Model);
  };
  if (typeof content === 'string') {
    content = HTMLParser(content);
  }
  const result: ViewData = {
    name,
    content,
    templateValidator: (attributes: Attribute[]) => {
      const attr = getModelAttribute(attributes);
      return !attr || (typeof attr.value === 'string');
    },
    createModelMap: (attributes: Attribute[]) => {
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
