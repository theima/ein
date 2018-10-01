import { StreamSubscribe } from '../types-and-interfaces/stream-subscribe';
import { Observable } from 'rxjs';
import { SubStreamSubscribe } from '../types-and-interfaces/sub-stream-subscribe';

export function getStaleStreams(oldStreams: StreamSubscribe[], newStreams: StreamSubscribe[]): SubStreamSubscribe[] {
  const liveStreams: Array<Observable<any>> = newStreams.map(s => s.stream);
  return oldStreams.reduce(
    (stale: SubStreamSubscribe[], s: StreamSubscribe) => {
      const index = liveStreams.indexOf(s.stream);
      if (index === -1) {
        return stale.concat(s.subStreams);
      }
      const activeSubStreams = newStreams[index].subStreams.map(s => s.stream);
      const staleSubStreams = s.subStreams.reduce(
        (stale: SubStreamSubscribe[], sub) => {
          if (activeSubStreams.indexOf(sub.stream) === -1) {
            stale.push(sub);
          }
          return stale;
        }, []);

      return stale.concat(staleSubStreams);
    }, []);
}
