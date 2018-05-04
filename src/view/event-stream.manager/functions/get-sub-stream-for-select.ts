import { StreamSubscribe } from '../interfaces/stream-subscribe';
import { EventSelect } from '../interfaces/event-select';
import { SubStreamSubscribe } from '../interfaces/sub-stream-subscribe';

export function getSubStreamForSelect(subscribe: StreamSubscribe, select: EventSelect): SubStreamSubscribe | null {
  return subscribe.subStreams.find(s => s.select === select) || null;
}
