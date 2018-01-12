import {TemplateElement} from './template-element';
import {Observable} from 'rxjs/Observable';
import {ViewEvent} from './view-event';
import {EventStreams} from '../event-streams';

export interface ViewData {
  tag: string;
  template: TemplateElement;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
}
