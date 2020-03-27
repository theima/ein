import { from, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

export function toSingleValueCan  <T>(observable: undefined | Observable<T>): Observable<T | true> {
  return !!observable ? observable.pipe(first()) : (from([true]) as Observable<true>);
}
