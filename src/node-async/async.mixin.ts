import * as findIndex from 'array-find-index';
import { Subscribable, Subscription, Unsubscribable } from 'rxjs';
import { Action, NodeBehaviorSubject, NodeConstructor } from '../core';
import { isSubscribable } from './is-subscribable';

export function asyncMixin<T, NBase extends NodeConstructor<NodeBehaviorSubject<T>>>(node: NBase): NBase {
  return class AsyncNode extends node {
    private activeUnsubscribes: Unsubscribable[] = [];

    constructor(...args: any[]) {
      super(...args);
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

    public dispose() {
      if (!this.disposed) {
        this.unsubscribeFromActive();
      }
      super.dispose();
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
