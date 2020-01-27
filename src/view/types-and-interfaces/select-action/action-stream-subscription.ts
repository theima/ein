import { Observable } from 'rxjs';
import { Action } from '../../../core';
import { ActionSelect } from './action-select';

export interface ActionStreamSubscription {
  for: ActionSelect;
  stream: Observable<Action>;
  subscription: {
    unsubscribe(): void;
  };
}
