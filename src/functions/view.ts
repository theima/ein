import {TemplateElement} from '../template-element';
import {Element} from '../element';
import {EventStreams} from '../event-streams';
import {Observable} from 'rxjs/Observable';
import {ViewEvent} from '../';

export function view(tag: string, template: Array<TemplateElement | string>,
                events?: (subscribe: EventStreams) => Observable<ViewEvent>): Element {
  let element: TemplateElement = {
    tag,
    children: template
  };
  const result: Element = {
    tag,
    element
  };
  if (events) {
    result.events = events;
  }
  return result;
}
