import { Element } from '../types-and-interfaces/elements/element';
import { getElements } from './get-elements';
import { replaceElement } from './replace-element';
import { getSubStreamForSelect } from './get-sub-stream-for-select';
import { getSubscribableElements } from './get-subscribable-elements';
import { ViewEventSource } from '../types-and-interfaces/view-event-source';
import { getSubscribeForStream } from './get-subscribe-for-stream';
import { setHandler } from './set-handler';
import { selectElements } from './select-elements';
import { StreamSubscribe } from '../types-and-interfaces/stream-subscribe';
import { ViewEvent } from '../types-and-interfaces/view-event';
import { getStaleStreams } from './get-stale-streams';
import { EventSelect } from '../types-and-interfaces/event-select';

export function createApplyEventHandlers(selects: EventSelect[]): (elements: Array<Element | string>) => Array<Element | string> {
  let activeSubscribes: StreamSubscribe[] = [];
  const handleEvents = (elements: Array<Element | string>) => {
    let newSubscribes: StreamSubscribe[] = [];
    const subscribable: Element[] = getSubscribableElements(getElements(elements));
    selects.forEach(
      select => {
        const subject = select.subject;
        const matches = selectElements(subscribable, select.selector);
        matches.forEach(
          (selectedElement) => {
            const send = (e: ViewEvent) => {
              let eWithSource: ViewEvent & ViewEventSource = {...e, eventSource: selectedElement};
              if (eWithSource.type !== e.type) {
                //A native event, we can't clone that.
                e.eventSource = selectedElement;
                eWithSource = e as any;
              }
              subject.next(eWithSource);
            };
            let newElement: Element = selectedElement;
            if (selectedElement.eventStream) {
              const stream = selectedElement.eventStream;
              const subscribe = getSubscribeForStream(newSubscribes, stream);
              const subSubscribe = getSubStreamForSelect(activeSubscribes, select, send, stream);
              let index = newSubscribes.indexOf(subscribe);
              if (index === -1) {
                index = newSubscribes.length;
                newSubscribes.push(subscribe);
              }
              newSubscribes[index] = {...subscribe, subStreams: subscribe.subStreams.concat([subSubscribe])};
            } else {
              newElement = setHandler(selectedElement, select, send);
              elements = replaceElement(elements, selectedElement, newElement);
            }
            const index = subscribable.indexOf(selectedElement);
            //replacing if there are multiple selects for this element.
            subscribable[index] = newElement;
          }
        );
      }
    );
    const stale = getStaleStreams(activeSubscribes, newSubscribes);
    stale.forEach(
      (s) => {
        s.subscription.unsubscribe();
      }
    );
    activeSubscribes = newSubscribes;
    return elements;
  };
  return handleEvents;
}
