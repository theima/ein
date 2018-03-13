import { TemplateElement } from '../types-and-interfaces/template-element';
import { ViewData } from '../types-and-interfaces/view-data';
import { EventStreams } from '../event-streams';
import { Observable } from 'rxjs/Observable';
import { Property, ViewEvent } from '../';
import { get } from '../../core';
import { BuiltIn } from '../types-and-interfaces/built-in';

export function view(name: string, content: Array<TemplateElement | string>,
                     events?: (subscribe: EventStreams) => Observable<ViewEvent>): ViewData {
  const getProp = (properties: Property[]) => {
    return properties
      .find(v => v.name === BuiltIn.Model);
  };
  const result: ViewData = {
    name,
    content,
    templateValidator: (properties: Property[]) => {
      const prop = getProp(properties);
      return !prop || (typeof prop.value === 'string');
    },
    modelMap: (properties: Property[]) => {
      const prop = getProp(properties);
      if (prop) {
        const keys = prop ? prop.value + '' : '';
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
