import {TemplateElement} from './template-element';
import {Observable} from 'rxjs/Observable';
import {ViewEvent} from './view-event';
import {EventStreams} from '../event-streams';
import {Attribute} from './attribute';
import {TemplateString} from './template-string';
import {ViewMap} from './view-map';
import {ViewValidator} from './view-validator';

export interface ViewData {
  tag: string;
  children: Array<TemplateElement | TemplateString>;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  viewMap: ViewMap;
  viewValidator: ViewValidator;
}
