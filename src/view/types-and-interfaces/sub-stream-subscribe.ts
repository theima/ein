import { Observable } from 'rxjs';
import { EventSelect } from './event-select';

export interface SubStreamSubscribe {
  select: EventSelect;
  stream: Observable<any>;
  subscription: {
    unsubscribe(): void;
  };
}
