import { EventStreams } from './types-and-interfaces/event-streams';
import { Observable } from 'rxjs/Observable';
import { ViewEvent } from './types-and-interfaces/view-event';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import { RenderInfo } from './types-and-interfaces/render-info';
import { arrayToDict, Dict, dictToArray } from '../core';
import { getRenderInfo } from './functions/get-render-info';
import { getSubscribableRenderInfo } from './functions/get-subscribable-render-info';
import { EventSelect } from './types-and-interfaces/event-select';
import { EventHandler } from './types-and-interfaces/event-handler';
import { replaceChild } from './functions/replace-child';

export class EventStreamSelector implements EventStreams {
  private selects: EventSelect[];

  constructor() {
    this.selects = [];
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
            selected.eventStream
              .filter(e => e.type === select.type)
              .subscribe((e) => subject.next(e));
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
    return dictToArray(changed).reduce(
      (i, child) => replaceChild(i, child)
    , i);
  }

}
