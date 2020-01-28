import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action } from '../../../../../core';
import { ActionSelect } from '../../../../types-and-interfaces/select-action/action-select';
import { ActionStreamSubscription } from '../../../../types-and-interfaces/select-action/action-stream-subscription';

export function createSubscriptionForSelect(stream: Observable<Action>, select: ActionSelect, handleAction: (a: Action) => void): ActionStreamSubscription {
  const subStream = stream.pipe(filter((a) => a.type === select.type));
  const subscription = subStream.subscribe((e) => {
      handleAction(e);
    });
  return {
      on: stream,
      for: select,
      stream: subStream,
      subscription
    };
}
