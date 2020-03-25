import { from, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Action } from '../../../core';
import { Prevent } from '../../types-and-interfaces/config/prevent';
export function joinCanObservables(cans: Array<Observable<boolean | Prevent>>): Observable<boolean | Prevent >;
export function joinCanObservables(cans: Array<Observable<boolean | Prevent | Action>>): Observable<boolean | Prevent | Action>;
export function joinCanObservables(cans: Array<Observable<boolean | object>>) {
  if (cans.length === 0) {
    return from([true]);
  }
  return cans.reduce((joined: Observable<boolean | Prevent | Action>, current: Observable<boolean | Prevent | Action>) => {
    if (joined) {
      return joined.pipe(flatMap((v: boolean | Prevent | Action) => {
        if (typeof v === 'object' || !v) {
          return from([v]);
        }
        return current;
      }));
    }
    return current;
  });
}
