import { Observable } from 'rxjs';
import { StreamSubscribe } from '../types-and-interfaces/stream-subscribe';

export function getSubscribeForStream(subscribes: StreamSubscribe[], stream: Observable<any>): StreamSubscribe {
  const subscribe: StreamSubscribe | undefined = subscribes.filter(
    s => s.stream === stream
  )[0];
  return subscribe || {
    stream,
    subStreams: []
  };
}
