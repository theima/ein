import { HtmlElementData } from '../types-and-interfaces/html-element-data';
import { Select } from '../../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { ViewEvent } from '../../view';

export function view(name: string,
                     template: string,
                     events?: (select: Select) => Observable<ViewEvent>): HtmlElementData {
  const result: HtmlElementData = {
    name,
    content: template
  };
  if (events) {
    result.events = events;
  }
  return result;
}
