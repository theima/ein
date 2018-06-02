import { Prevent } from '../types-and-interfaces/prevent';
import { Observable, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Action } from '../../model';
export function joinCan(cans: Array<Observable<boolean | Prevent>>): Observable<boolean | Prevent >;
export function joinCan(cans: Array<Observable<boolean | Prevent | Action>>): Observable<boolean | Prevent | Action>;
export function joinCan(cans: Array<Observable<boolean | object>>) {
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
