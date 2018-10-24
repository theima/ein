import { Observable } from 'rxjs';

export interface NativeElementStreams<T> {
  added: Observable<T[]>;
  removed: Observable<T[]>;
}
