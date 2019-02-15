import { Element } from '../types-and-interfaces/elements/element';
import { getElements } from './get-elements';
import { replaceElement } from './replace-element';
import { getSubStreamForSelect } from './get-sub-stream-for-select';
import { getSubscribableElements } from './get-subscribable-elements';
import { ActionSource } from '../types-and-interfaces/action-source';
import { getSubscribeForStream } from './get-subscribe-for-stream';
import { setHandler } from './set-handler';
import { selectElements } from './select-elements';
import { StreamSubscribe } from '../types-and-interfaces/stream-subscribe';
import { getStaleStreams } from './get-stale-streams';
import { ActionSelect } from '../types-and-interfaces/action-select';
import { Action } from '../../core';

export function createApplyActionHandlers(selects: ActionSelect[]): (elements: Array<Element | string>) => Array<Element | string> {
  let activeSubscribes: StreamSubscribe[] = [];
  const handleActions = (elements: Array<Element | string>) => {
    let newSubscribes: StreamSubscribe[] = [];
    const subscribable: Element[] = getSubscribableElements(getElements(elements));
    selects.forEach(
      select => {
        const subject = select.subject;
        const matches = selectElements(subscribable, select.selector);
        matches.forEach(
          (selectedElement) => {
            const send = (action: Action) => {
              let aWithSource: Action & ActionSource = {...action, actionSource: selectedElement};
              if (aWithSource.type !== action.type) {
                //A native event, we can't clone that.
                //we'll see if we can mutate.
                action.actionSource = selectedElement;
                aWithSource = action as any;
              }
              subject.next(aWithSource);
            };
            let newElement: Element = selectedElement;
            if (selectedElement.actionStream) {
              const stream = selectedElement.actionStream;
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
  return handleActions;
}
