import { Observable } from 'rxjs';
import { Action } from '../../../../../core';
import { ActionSelect } from '../../../../types-and-interfaces/select-action/action-select';
import { ActionStreamSubscription } from '../../../../types-and-interfaces/select-action/action-stream-subscription';

export function matchToSubscription(onStream: Observable<Action>,forSelect: ActionSelect, a: ActionStreamSubscription): boolean {
  return a.for === forSelect && a.on === onStream;
}
