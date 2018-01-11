import {TemplateElement} from '../template-element';
import {ViewData} from '../types-and-interfaces/view-data';
import {EventStreams} from '../event-streams';
import {Observable} from 'rxjs/Observable';
import {ViewEvent} from '../';

export function view(tag: string, children: Array<TemplateElement | string>,
                events?: (subscribe: EventStreams) => Observable<ViewEvent>): ViewData {

  const result: ViewData = {
    tag,
    template: {
      tag,
      children
    }
  };
  if (events) {
    result.events = events;
  }
  return result;
}
