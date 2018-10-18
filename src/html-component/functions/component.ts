import { HtmlComponentElementData } from '../types-and-interfaces/html-component-element-data';
import { Select, ViewEvent } from '../../view';
import { Observable } from 'rxjs';

export function component(name: string, template: string, events?: (select: Select) => Observable<ViewEvent>): HtmlComponentElementData {
  let data: HtmlComponentElementData = {
    name,
    content: template
  };
  if (events) {
    data.events = events;
  }
  return data;
}
