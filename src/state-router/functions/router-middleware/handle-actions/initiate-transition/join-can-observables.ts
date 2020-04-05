import { from, Observable } from 'rxjs';
import { first, flatMap } from 'rxjs/operators';
import { Action } from '../../../../../core';
import { Prevent } from '../../../../types-and-interfaces/config/prevent';
export function joinCanObservables(cans: Array<Observable<boolean | Prevent>>): Observable<boolean | Prevent >;
export function joinCanObservables(cans: Array<Observable<boolean | Prevent | Action>>): Observable<boolean | Prevent | Action>;
export function joinCanObservables(cans: Array<Observable<boolean | object>>) {
  if (cans.length === 0) {
    return from([true]);
  }
  const canObservable = cans.reduce((joined: Observable<boolean | Prevent | Action>, current: Observable<boolean | Prevent | Action>) => {
      return joined.pipe(flatMap((v: boolean | Prevent | Action) => {
        if (typeof v === 'object' || !v) {
          return from([v]);
        }
        return current;
      }));
  });
  return canObservable.pipe(
    first()
  );
}
