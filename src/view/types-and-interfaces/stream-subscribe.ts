import { Observable } from 'rxjs';
import { SubStreamSubscribe } from './sub-stream-subscribe';

export interface StreamSubscribe {
  stream: Observable<any>;
  subStreams: SubStreamSubscribe[];
}
