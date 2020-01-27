import { Observable } from 'rxjs';
import { ActionStreamSubscription } from './action-stream-subscription';

export interface ActionStreamSubscriptions {
  on: Observable<any>;
  subscriptions: ActionStreamSubscription[];
}
