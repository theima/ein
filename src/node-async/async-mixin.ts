import * as findIndex from 'array-find-index';
import { Observable, Subscribable, Subscription, Unsubscribable } from 'rxjs';
import { Action, NodeBehaviorSubject, NodeConstructor } from '../core';
import { ActionMapsWithAsync } from './action-maps-with-async';
import { isSubscribable } from './is-subscribable';
import { triggerAsync } from './trigger-async';

export function asyncMixin<T, NBase extends NodeConstructor<NodeBehaviorSubject<T>>>(node: NBase): NBase {
  return class extends node {
    private activeUnsubscribes: Unsubscribable[] = [];
    private asyncTriggerMap: (model: T, actions: Action[]) => Array<Observable<Action>>;

    constructor(...args: any[]) {
      super(...args);
      let actionMaps: ActionMapsWithAsync<T> = args[1];
      this.asyncTriggerMap = triggerAsync(actionMaps);
    }

    public next(action: Action): Action;
    public next(async: Subscribable<Action>): Subscribable<Action>;
    public next(action: Action | Subscribable<Action>): Action | Subscribable<Action> {
      if (isSubscribable(action)) {
        return this.handleAsync(action);
      } else {
        return super.next(action as Action);
      }
    }

    protected dispose() {
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
      this.activeUnsubscribes.forEach((item: Unsubscribable) => {
        item.unsubscribe();
      });
      this.activeUnsubscribes = [];
    }

    private handleAsync(async: Subscribable<Action>): Subscribable<Action> {
      const unsubscribable: Unsubscribable = async.subscribe((value: Action) => {
        this.next(value);
      }, (error: any) => {
        throw new Error('Received error from asynchronous action observable');
      }, () => {
        const index: number = findIndex(this.activeUnsubscribes, (item: Subscription) => {
          return item === unsubscribable;
        });
        this.activeUnsubscribes.splice(index, 1);
      });
      this.activeUnsubscribes.push(unsubscribable);
      return async;
    }
  };
}
