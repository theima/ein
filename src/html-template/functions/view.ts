import { TemplateElement } from '../types-and-interfaces/template-element';
import { ViewData } from '../types-and-interfaces/view-data';
import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams } from '../../view';
import { get } from '../../core';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { TemplateAttribute } from '../types-and-interfaces/template-attribute';

export function view(name: string, content: Array<TemplateElement | string>,
                     events?: (subscribe: EventStreams) => Observable<ViewEvent>): ViewData {
  const getModelAttribute = (attributes: TemplateAttribute[]) => {
    return attributes
      .find(a => a.name === BuiltIn.Model);
  };
  const result: ViewData = {
    name,
    content,
    templateValidator: (attributes: TemplateAttribute[]) => {
      const attr = getModelAttribute(attributes);
      return !attr || (typeof attr.value === 'string');
    },
    createModelMap: (attributes: TemplateAttribute[]) => {
      const attr = getModelAttribute(attributes);
      if (attr) {
        const keys = attr ? attr.value + '' : '';
        return m => get(m, keys);
      }
      return m => m;
    }
  };
  if (events) {
    result.events = events;
  }
  return result;
}
