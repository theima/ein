import {TemplateElement} from './template-element';
import {Observable} from 'rxjs/Observable';
import {ViewEvent} from './types-and-interfaces/view-event';
import {EventStreams} from './event-streams';

export interface Element {
  tag: string;
  element: TemplateElement;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
}
