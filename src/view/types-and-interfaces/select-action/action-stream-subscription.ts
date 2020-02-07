import { Observable } from 'rxjs';
import { Action } from '../../../core';
import { ActionSelect } from './action-select';

export interface ActionStreamSubscription {
  on: Observable<Action>;
  for: ActionSelect;
  unsubscribe(): void;
}
