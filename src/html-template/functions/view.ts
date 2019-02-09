import { HtmlViewElementData } from '../types-and-interfaces/html-view-element-data';
import { Select } from '../../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { ViewEvent } from '../../view';

export function view(name: string,
                     template: string,
                     events?: (select: Select) => Observable<ViewEvent>): HtmlViewElementData {
  if (!events) {
    events = () => new Observable<ViewEvent>();
  }
  const result: HtmlViewElementData = {
    name,
    content: template,
    events
  };

  return result;
}
