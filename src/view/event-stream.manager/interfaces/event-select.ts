import { ViewEvent } from '../../types-and-interfaces/view-event';
import { Subject } from 'rxjs/Subject';
import { Selector } from './selector';

export interface EventSelect {
  selector: Selector;
  subject: Subject<ViewEvent>;
  type: string;
}
