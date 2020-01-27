import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action } from '../../../../core';
import { ActionSelect } from '../../../types-and-interfaces/select-action/action-select';
import { ActionStreamSubscription } from '../../../types-and-interfaces/select-action/action-stream-subscription';
import { ActionStreamSubscriptions } from '../../../types-and-interfaces/select-action/action-stream-subscriptions';

export function getSubscriptionForSelect(subscriptions: ActionStreamSubscriptions, select: ActionSelect, handleAction: (a: Action) => void, actionStream: Observable<Action>): ActionStreamSubscription {

  let streamSubscription: ActionStreamSubscription | undefined = subscriptions.subscriptions.find((s) => s.for === select);
  if (!streamSubscription) {
    const subStream = actionStream.pipe(filter((e) => e.type === select.type));
    const subscription = subStream.subscribe((e) => {
      handleAction(e);
    });
    streamSubscription = {
      for: select,
      stream: subStream,
      subscription
    };
  }
  return streamSubscription;
}
