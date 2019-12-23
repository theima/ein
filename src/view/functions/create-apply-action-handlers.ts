import { Observable } from 'rxjs';
import { Action } from '../../core';
import { ActionSelect } from '../types-and-interfaces/action-select';
import { ActionSource } from '../types-and-interfaces/action-source';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { Element } from '../types-and-interfaces/elements/element';
import { StreamSubscribe } from '../types-and-interfaces/stream-subscribe';
import { getElements } from './get-elements';
import { getProperty } from './get-property';
import { getStaleStreams } from './get-stale-streams';
import { getSubStreamForSelect } from './get-sub-stream-for-select';
import { getSubscribableElements } from './get-subscribable-elements';
import { getSubscribeForStream } from './get-subscribe-for-stream';
import { replaceElement } from './replace-element';
import { selectElements } from './select-elements';
import { setHandler } from './set-handler';

export function createApplyActionHandlers(selects: ActionSelect[]): (elements: Array<Element | string>) => Array<Element | string> {
  let activeSubscribes: StreamSubscribe[] = [];
  const handleActions = (elements: Array<Element | string>) => {
    let newSubscribes: StreamSubscribe[] = [];
    const subscribable: Element[] = getSubscribableElements(getElements(elements));
    selects.forEach(
      (select) => {
        const subject = select.subject;
        const matches = selectElements(subscribable, select.selector);
        matches.forEach(
          (selectedElement) => {
            const send = (action: Action) => {
              let aWithSource: Action & ActionSource = {...action, actionSource: selectedElement};
              if (aWithSource.type !== action.type) {
                // A native event, we can't clone that.
                // we'll see if we can mutate.
                action.actionSource = selectedElement;
                aWithSource = action as any;
              }
              subject.next(aWithSource);
            };
            let newElement: Element = selectedElement;
            const actionStreamProperty = getProperty(BuiltIn.ActionStream, selectedElement.properties);
            const actionStream: Observable<Action> | null = actionStreamProperty ? actionStreamProperty.value as Observable<Action> : null;
            if (actionStream) {
              const subscribe = getSubscribeForStream(newSubscribes, actionStream);
              const subSubscribe = getSubStreamForSelect(activeSubscribes, select, send, actionStream);
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
            // replacing if there are multiple selects for this element.
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
