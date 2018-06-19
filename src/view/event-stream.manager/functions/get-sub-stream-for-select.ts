import { StreamSubscribe } from '../interfaces/stream-subscribe';
import { EventSelect } from '../interfaces/event-select';
import { SubStreamSubscribe } from '../interfaces/sub-stream-subscribe';
import { getSubscribeForStream } from './get-subscribe-for-stream';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ViewEvent } from '../../types-and-interfaces/view-event';

export function getSubStreamForSelect(subscribes: StreamSubscribe[], select: EventSelect, handleEvent: (e: ViewEvent) => void, stream: Observable<any>): SubStreamSubscribe {
  let subscribe: StreamSubscribe = getSubscribeForStream(subscribes, stream);
  let subSubscribe: SubStreamSubscribe | undefined = subscribe.subStreams.find(s => s.select === select);
  if (!subSubscribe) {
    const subStream = stream.pipe(filter(e => e.type === select.type));
    const subscription = subStream.subscribe((e) => {
      handleEvent(e);
    });
    subSubscribe = {
      select,
      stream: subStream,
      subscription
    };
  }
  return subSubscribe;
}
