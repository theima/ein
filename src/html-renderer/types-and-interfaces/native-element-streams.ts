import { Observable } from 'rxjs';

export interface NativeElementStreams {
  added: Observable<Element[]>;
  removed: Observable<Element[]>;
}
