import { StreamSubscribe } from '../types-and-interfaces/stream-subscribe';
import { ActionSelect } from '../types-and-interfaces/action-select';
import { SubStreamSubscribe } from '../types-and-interfaces/sub-stream-subscribe';
import { getSubscribeForStream } from './get-subscribe-for-stream';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action } from '../../core';

export function getSubStreamForSelect(subscribes: StreamSubscribe[], select: ActionSelect, handleAction: (a: Action) => void, stream: Observable<any>): SubStreamSubscribe {
  let subscribe: StreamSubscribe = getSubscribeForStream(subscribes, stream);
  let subSubscribe: SubStreamSubscribe | undefined = subscribe.subStreams.find(s => s.select === select);
  if (!subSubscribe) {
    const subStream = stream.pipe(filter(e => e.type === select.type));
    const subscription = subStream.subscribe((e) => {
      handleAction(e);
    });
    subSubscribe = {
      select,
      stream: subStream,
      subscription
    };
  }
  return subSubscribe;
}
