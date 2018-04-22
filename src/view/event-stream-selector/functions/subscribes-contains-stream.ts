import { StreamSubscribe } from '../interfaces/stream-subscribe';
import { Observable } from 'rxjs/Observable';
import { getSubscribeForStream } from './get-subscribe-for-stream';

export function subscribesContainsStream(subscribes: StreamSubscribe[], stream: Observable<any>): boolean {
  return !!getSubscribeForStream(subscribes, stream);
}
