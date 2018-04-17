import { EventStreams } from './types-and-interfaces/event-streams';
import { Observable } from 'rxjs/Observable';
import { ViewEvent } from './types-and-interfaces/view-event';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import { RenderInfo } from './types-and-interfaces/render-info';
import { arrayToDict, Dict, dictToArray } from '../core';
import { getRenderInfo } from './functions/get-render-info';
import { getSubscribableRenderInfo } from './functions/get-subscribable-render-info';
import { Selector } from './types-and-interfaces/selector';
import { EventHandler } from './types-and-interfaces/event-handler';
import { replaceChild } from './functions/replace-child';

export class EventStreamSelector implements EventStreams {
  private selectors: Selector[];

  constructor() {
    this.selectors = [];
  }

  public select(selector: string, type: string): Observable<ViewEvent> {
    const subject: Subject<ViewEvent> = new Subject<ViewEvent>();
    this.selectors.push(
      {
        subject,
        selector,
        type
      }
    );
    return subject;
  }

  public process(i: RenderInfo): RenderInfo {
    const changed: Dict<RenderInfo> = {};
    const subscribable: Dict<RenderInfo> = arrayToDict('id',
      getSubscribableRenderInfo(
        getRenderInfo(i.content))
        .filter(
          (elm: RenderInfo) => {
            return !!elm.id;
          }));
    this.selectors.forEach(
      selector => {
        const subject = selector.subject;
        const selected = subscribable[selector.selector];
        if (selected) {
          let newInfo: RenderInfo = selected;
          if (selected.eventStream) {
            selected.eventStream
              .filter(e => e.type === selector.type)
              .subscribe((e) => subject.next(e));
          } else {
            const handlers = selected.eventHandlers || [];
            const currentHandler: EventHandler = handlers.filter(
              h => h.for === 'type'
            )[0];
            const handler = (e: ViewEvent) => {
              if (currentHandler) {
                currentHandler.handler(e);
              }
              subject.next(e);
            };
            const eventHandler = {
              for: selector.type,
              handler
            };
            newInfo = {...selected};
            if (currentHandler) {
              handlers.splice(handlers.indexOf(currentHandler), 1, eventHandler);
            } else {
              handlers.push(eventHandler);
            }
            newInfo.eventHandlers = handlers.concat();
            changed[selector.selector] = newInfo;
          }
          subscribable[selector.selector] = newInfo;
        }
      }
    );
    return dictToArray(changed).reduce(
      (i, child) => replaceChild(i, child)
    , i);
  }

}
