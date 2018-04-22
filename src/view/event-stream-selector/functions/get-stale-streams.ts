import { StreamSubscribe } from '../interfaces/stream-subscribe';
import { Observable } from 'rxjs/Observable';

export function getStaleStreams(oldStreams: StreamSubscribe[], newStreams: StreamSubscribe[]): StreamSubscribe[] {
  const liveStreams: Array<Observable<any>> = newStreams.map(s => s.stream);
  return oldStreams.reduce(
    (stale: StreamSubscribe[], s: StreamSubscribe) => {
      if (liveStreams.indexOf(s.stream) === -1) {
        stale.push(s);
      }
      return stale;
    }, []);
}
