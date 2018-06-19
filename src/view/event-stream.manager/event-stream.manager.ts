import { EventStreams } from '../types-and-interfaces/event-streams';
import { Observable, Subject } from 'rxjs';
import { ViewEvent } from '../types-and-interfaces/view-event';
import { Element } from '../types-and-interfaces/element';
import { getElements } from '../functions/get-elements';
import { getSubscribableElements } from '../functions/get-subscribable-elements';
import { EventSelect } from './interfaces/event-select';
import { replaceChild } from '../functions/replace-child';
import { StreamSubscribe } from './interfaces/stream-subscribe';
import { getSubscribeForStream } from './functions/get-subscribe-for-stream';
import { getStaleStreams } from './functions/get-stale-streams';
import { createSelector } from './functions/create-selector';
import { selectElements } from './functions/select-elements';
import { getSubStreamForSelect } from './functions/get-sub-stream-for-select';
import { ViewEventSource } from '../types-and-interfaces/view-event-source';
import { setHandler } from './functions/set-handler';

export class EventStreamManager implements EventStreams {
  private selects: EventSelect[];
  private subscribes: StreamSubscribe[];

  constructor() {
    this.selects = [];
    this.subscribes = [];
  }

  public select(selector: string, type: string): Observable<ViewEvent & ViewEventSource> {
    const subject: Subject<ViewEvent & ViewEventSource> = new Subject<ViewEvent & ViewEventSource>();
    this.selects.push(
      {
        subject,
        selector: createSelector(selector),
        type
      }
    );
    return subject;
  }

  public process(root: Element): Element {
    let newSubscribes: StreamSubscribe[] = [];
    const subscribable: Element[] = getSubscribableElements(getElements(root.content));
    this.selects.forEach(
      select => {
        const subject = select.subject;
        const matches = selectElements(subscribable, select.selector);
        matches.forEach(
          (selectedElement) => {
            const send = (e: ViewEvent) => {
              const eventSource = selectedElement;
              const eWithSource: ViewEvent & ViewEventSource = {...e, eventSource};
              subject.next(eWithSource);
            };
            let newElement: Element = selectedElement;
            if (selectedElement.eventStream) {
              const stream = selectedElement.eventStream;
              const subscribe = getSubscribeForStream(newSubscribes, stream);
              const subSubscribe = getSubStreamForSelect(this.subscribes, select, send, stream);
              let index = newSubscribes.indexOf(subscribe);
              if (index === -1) {
                index = newSubscribes.length;
                newSubscribes.push(subscribe);
              }
              newSubscribes[index] = {...subscribe, subStreams: subscribe.subStreams.concat([subSubscribe])};
            } else {
              newElement = setHandler(selectedElement, select, send);
              root = replaceChild(root, selectedElement, newElement);
            }
            const index = subscribable.indexOf(selectedElement);
            //replacing if there are multiple selects for this element.
            subscribable[index] = newElement;
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
