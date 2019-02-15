import { Observable } from 'rxjs';
import { ActionSelect } from './action-select';

export interface SubStreamSubscribe {
  select: ActionSelect;
  stream: Observable<any>;
  subscription: {
    unsubscribe(): void;
  };
}
