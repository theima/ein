import { ViewEvent } from './view-event';
import { Subject } from 'rxjs';
import { Selector } from './selector';

export interface EventSelect {
  selector: Selector;
  subject: Subject<ViewEvent>;
  type: string;
}
