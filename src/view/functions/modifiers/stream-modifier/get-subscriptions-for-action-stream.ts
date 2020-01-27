import { Observable } from 'rxjs';
import { Action } from '../../../../core';
import { ActionStreamSubscriptions } from '../../../types-and-interfaces/select-action/action-stream-subscriptions';

export function getSubscriptionsForActionStream(subscriptions: ActionStreamSubscriptions[], actionStream: Observable<Action>): ActionStreamSubscriptions {
  const subscribe: ActionStreamSubscriptions | undefined = subscriptions.filter(
    (s) => s.on === actionStream
  )[0];
  return subscribe || {
    on: actionStream,
    subscriptions: []
  };
}
