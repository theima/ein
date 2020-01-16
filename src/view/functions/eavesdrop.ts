import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function eavesdrop<T>(stream: Observable<T>, callback: (value: T) => void) {
  const eavesdropper = (value: T) => {
    callback(value);
    return value;
  };
  return stream.pipe(map(eavesdropper));
}
