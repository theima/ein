import { EventStreams } from '../types-and-interfaces/event-streams';
import { Observable } from 'rxjs/Observable';
import { ViewEvent } from '../types-and-interfaces/view-event';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import { RenderInfo } from '../types-and-interfaces/render-info';
import { getRenderInfo } from '../functions/get-render-info';
import { getSubscribableRenderInfo } from '../functions/get-subscribable-render-info';
import { EventSelect } from './interfaces/event-select';
import { EventHandler } from '../types-and-interfaces/event-handler';
import { replaceChild } from '../functions/replace-child';
import { StreamSubscribe } from './interfaces/stream-subscribe';
import { getSubscribeForStream } from './functions/get-subscribe-for-stream';
import { SubStreamSubscribe } from './interfaces/sub-stream-subscribe';
import { getStaleStreams } from './functions/get-stale-streams';
import { createSelector } from './functions/create-selector';
import { selectRenderInfo } from './functions/select-render-info';
import { getSubStreamForSelect } from './functions/get-sub-stream-for-select';

export class EventStreamManager implements EventStreams {
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
        selector: createSelector(selector),
        type
      }
    );
    return subject;
  }

  public process(root: RenderInfo): RenderInfo {
    let newSubscribes: StreamSubscribe[] = [];
    const subscribable: RenderInfo[] = getSubscribableRenderInfo(getRenderInfo(root.content));
    this.selects.forEach(
      select => {
        const subject = select.subject;
        const matches = selectRenderInfo(subscribable, select.selector);
        matches.forEach(
          (selected) => {
            let newInfo: RenderInfo = selected;
            if (selected.eventStream) {
              const stream = selected.eventStream;
              let subscribe: StreamSubscribe | null = getSubscribeForStream(this.subscribes, stream);
              let subSubscribe: SubStreamSubscribe | null = null;
              if (subscribe) {
                //We reuse the old one if it exists in the old.
                subSubscribe = getSubStreamForSelect(subscribe, select);
              }
              subscribe = getSubscribeForStream(newSubscribes, stream);
              if (!subscribe) {
                subscribe = {
                  stream,
                  subStreams: []
                };
              }
              if (!subSubscribe) {
                const subStream = stream.filter(e => e.type === select.type);
                const subscription = subStream.subscribe((e) => {
                  subject.next(e);
                });
                subSubscribe = {
                  select,
                  stream: subStream,
                  subscription
                };
              }
              if (newSubscribes.indexOf(subscribe) === -1) {
                newSubscribes.push(subscribe);
              }
              const index = newSubscribes.indexOf(subscribe);
              newSubscribes[index] = {...subscribe, subStreams: subscribe.subStreams.concat([subSubscribe])};

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
              root = replaceChild(root, selected, newInfo);
            }
            const index = subscribable.indexOf(selected);
            subscribable[index] = newInfo;
          }
        );
      }
    );
    const stale = getStaleStreams(this.subscribes, newSubscribes);
    stale.forEach(
      (s) => {
        s.subscription.unsubscribe();
      }
    );
    this.subscribes = newSubscribes;
    return root;
  }

}
