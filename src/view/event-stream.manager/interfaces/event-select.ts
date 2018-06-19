import { ViewEvent } from '../../types-and-interfaces/view-event';
import { Subject } from 'rxjs';
import { Selector } from './selector';
import { ViewEventSource } from '../../types-and-interfaces/view-event-source';

export interface EventSelect {
  selector: Selector;
  subject: Subject<ViewEvent & ViewEventSource>;
  type: string;
}
