import { Observable } from 'rxjs/Observable';
import { EventSelect } from './event-select';

export interface SubStreamSubscribe {
  select: EventSelect;
  stream: Observable<any>;
  subscription: {
    unsubscribe(): void;
  };
}
