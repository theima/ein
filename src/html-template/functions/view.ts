import { Observable } from 'rxjs';
import { EventStreams, ViewEvent } from '../../view';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';

export function view(name: string,
                     template: string,
                     events?: (subscribe: EventStreams) => Observable<ViewEvent>): HtmlElementData {
  const result: HtmlElementData = {
    name,
    content: template
  };
  if (events) {
    result.events = events;
  }
  return result;
}
