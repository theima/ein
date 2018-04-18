import { EventStreams } from '../types-and-interfaces/event-streams';
import { Observable } from 'rxjs/Observable';
import { ViewEvent } from '../types-and-interfaces/view-event';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import { RenderInfo } from '../types-and-interfaces/render-info';
import { arrayToDict, Dict, dictToArray } from '../../core/index';
import { getRenderInfo } from '../functions/get-render-info';
import { getSubscribableRenderInfo } from '../functions/get-subscribable-render-info';
import { EventSelect } from './interfaces/event-select';
import { EventHandler } from '../types-and-interfaces/event-handler';
import { replaceChild } from '../functions/replace-child';
import { StreamSubscribe } from './interfaces/stream-subscribe';
import { subscribesContainsStream } from './functions/subscribes-contains-stream';
import { getSubscribeForStream } from './functions/get-subscribe-for-stream';
import { SubStreamSubscribe } from './interfaces/sub-stream-subscribe';

export class EventStreamSelector implements EventStreams {
  private selects: EventSelect[];
  private subscribes: StreamSubscribe[];

  constructor() {
    this.selects = [];
    this.subscribes = [];
  }

  public select(selector: string, type: string): Observable<ViewEvent> {
    const subject: Subject<ViewEvent> = new Subject<ViewEvent>();
    this.selects.push(
      {
        subject,
        selector,
        type
      }
    );
    return subject;
  }

  public process(i: RenderInfo): RenderInfo {
    let newSubscribes: StreamSubscribe[] = [];
    const changed: Dict<RenderInfo> = {};
    const subscribable: Dict<RenderInfo> = arrayToDict('id',
      getSubscribableRenderInfo(
        getRenderInfo(i.content))
        .filter(
          (elm: RenderInfo) => {
            return !!elm.id;
          }));
    this.selects.forEach(
      select => {
        const subject = select.subject;
        const selected = subscribable[select.selector];
        if (selected) {
          let newInfo: RenderInfo = selected;
          if (selected.eventStream) {
            const stream = selected.eventStream;
            let subscribe: StreamSubscribe;
            if (subscribesContainsStream(this.subscribes, stream)) {
              //This is an old stream, we've already subscribed.
              subscribe = getSubscribeForStream(this.subscribes, stream) as StreamSubscribe;
            } else {
              const subStream = stream.filter(e => e.type === select.type);
              const subscription = subStream.subscribe((e) => {
                subject.next(e);
              });
              const existing: StreamSubscribe | null = getSubscribeForStream(newSubscribes, stream);
              const subSubscribe: SubStreamSubscribe = {
                type: select.type,
                stream: subStream,
                subscription
              };
              if (existing) {
                subscribe = {...existing, subStreams: existing.subStreams.concat([subSubscribe])};
              } else {
                subscribe = {
                  stream,
                  subStreams: [subSubscribe]
                };
              }
            }
            newSubscribes.push(subscribe);
          } else {
            const handlers = selected.eventHandlers || [];
            const currentHandler: EventHandler = handlers.filter(
              h => h.for === select.type
            )[0];

            const handler = (e: ViewEvent) => {
              if (currentHandler) {
                currentHandler.handler(e);
              }
              subject.next(e);
            };
            const eventHandler = {
              for: select.type,
              handler
            };
            newInfo = {...selected};
            if (currentHandler) {
              handlers.splice(handlers.indexOf(currentHandler), 1, eventHandler);
            } else {
              handlers.push(eventHandler);
            }
            newInfo.eventHandlers = handlers.concat();
            changed[select.selector] = newInfo;
          }
          subscribable[select.selector] = newInfo;
        }
      }
    );
    this.subscribes = newSubscribes;
    return dictToArray(changed).reduce(
      (i, child) => replaceChild(i, child)
      , i);
  }

}
