import { StreamSubscribe } from '../interfaces/stream-subscribe';
import { Observable } from 'rxjs';

export function getSubscribeForStream(subscribes: StreamSubscribe[], stream: Observable<any>): StreamSubscribe {
  const subscribe: StreamSubscribe | undefined = subscribes.filter(
    s => s.stream === stream
  )[0];
  return subscribe || {
    stream,
    subStreams: []
  };
}
