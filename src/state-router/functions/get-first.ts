import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

export function getFirst<T>(observable: Observable<T>): Observable<T> {
  return observable.pipe(first());
}
