import { Subscribable } from 'rxjs';
import { Action } from '../core';
import { isFunction } from '../core/functions/is-function';

export function isSubscribable(o: Action | Subscribable<Action>): o is Subscribable<Action> {
  return isFunction((o as any).subscribe);
}
