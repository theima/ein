import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';

export function getFirst<T>(observable: Observable<T>): Observable<T> {
  return observable.first();
}
