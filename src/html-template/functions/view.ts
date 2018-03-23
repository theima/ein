import { TemplateElement } from '../types-and-interfaces/template-element';
import { ViewData } from '../types-and-interfaces/view-data';
import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams } from '../../view/';
import { get } from '../../core';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { Attribute } from '../types-and-interfaces/attribute';

export function view(name: string, content: Array<TemplateElement | string>,
                     events?: (subscribe: EventStreams) => Observable<ViewEvent>): ViewData {
  const getModelAttribute = (attributes: Attribute[]) => {
    return attributes
      .find(a => a.name === BuiltIn.Model);
  };
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
