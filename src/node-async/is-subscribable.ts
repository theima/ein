import { Subscribable } from 'rxjs';
import { Action } from '../core';

export function isSubscribable(o: Action | Subscribable<Action>): o is Subscribable<Action> {
  return (typeof o === 'function' || typeof o === 'object') && (o as any).subscribe;
}
