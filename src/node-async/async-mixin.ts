import { Observable, Subscription } from 'rxjs';
import * as findIndex from 'array-find-index';
import { triggerAsync } from './trigger-async';
import { ActionMapsWithAsync } from './action-maps-with-async';
import { Action, NodeConstructor, NodeSubject } from '../core';

export function asyncMixin<T, NBase extends NodeConstructor<NodeSubject<T>>>(node: NBase): NBase {
  return class extends node {
    private activeSubscriptions: Subscription[] = [];
    private asyncTriggerMap: (model: T, actions: Action[]) => Array<Observable<Action>>;

    constructor(...args: any[]) {
      super(...args);
      let actionMaps: ActionMapsWithAsync<T> = args[1];
      this.asyncTriggerMap = triggerAsync(actionMaps);
    }

    public next(action: Action): Action;
    public next(async: Observable<Action>): Observable<Action>;
    public next(action: Action | Observable<Action>): Action | Observable<Action> {
      if (action instanceof Observable) {
        return this.handleAsync(action);
      } else {
        return super.next(action as Action);
      }
    }

    public dispose() {
      if (!this.disposed) {
        this.unsubscribeFromActive();
      }
      super.dispose();
    }

    protected executeAction(action: Action): Action {
      let newAction: Action = super.executeAction(action);
      this.handleTriggerAsync([action]);
      return newAction;
    }

    protected childUpdated(model: T, actions: Action[]) {
      super.childUpdated(model, actions);
      this.handleTriggerAsync(actions);
    }

    private handleTriggerAsync(actions: Action []) {
      if (this.asyncTriggerMap) {
        let asyncs: Array<Observable<Action>> = this.asyncTriggerMap(this.model as T, actions);
        asyncs.forEach((async: Observable<Action>) => {
          this.handleAsync(async);
        });
      }
    }

    private unsubscribeFromActive() {
      this.activeSubscriptions.forEach((item: Subscription) => {
        item.unsubscribe();
      });
      this.activeSubscriptions = [];
    }

    private handleAsync(async: Observable<Action>): Observable<Action> {
      const subscription: Subscription = async.subscribe((value: Action) => {
        this.next(value);
      }, (error: any) => {
        throw new Error('Received error from asynchronous action observable');
      }, () => {
        const index: number = findIndex(this.activeSubscriptions, (item: Subscription) => {
          return item === subscription;
        });
        this.activeSubscriptions.splice(index, 1);
      });
      this.activeSubscriptions.push(subscription);
      return async;
    }
  };
}
