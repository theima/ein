import {TemplateElement} from '../types-and-interfaces/template-element';
import {ViewData} from '../types-and-interfaces/view-data';
import {EventStreams} from '../event-streams';
import {Observable} from 'rxjs/Observable';
import {Attribute, ViewEvent} from '../';
import {get} from '../core/get';

export function view(name: string, children: Array<TemplateElement | string>,
                     events?: (subscribe: EventStreams) => Observable<ViewEvent>): ViewData {
  const modelAttributeName: string = 'model';
  const getProp = (attributes: Attribute[]) => {
    return attributes
      .find(v => v.name === modelAttributeName);
  }
  const result: ViewData = {
    name,
    children,
    templateValidator: (attributes: Attribute[]) => {
      const prop = getProp(attributes);
      return !prop || (typeof prop.value === 'string');
    },
    modelMap: (attributes: Attribute[]) => {
      const prop = getProp(attributes);
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
