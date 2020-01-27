import { Observable } from 'rxjs';
import { Action } from '../../../../core';
import { BuiltIn } from '../../../types-and-interfaces/built-in';
import { Element } from '../../../types-and-interfaces/elements/element';
import { ElementContent } from '../../../types-and-interfaces/elements/element-content';
import { ActionSelect } from '../../../types-and-interfaces/select-action/action-select';
import { ActionSource } from '../../../types-and-interfaces/select-action/action-source';
import { ActionStreamSubscriptions } from '../../../types-and-interfaces/select-action/action-stream-subscriptions';
import { getElements } from '../../get-elements';
import { getProperty } from '../../get-property';
import { getMatchingElements } from './get-matching-elements';
import { getStaleStreams } from './get-stale-streams';
import { getSubscribableElements } from './get-subscribable-elements';
import { getSubscriptionForSelect } from './get-subscription-for-select';
import { getSubscriptionsForActionStream } from './get-subscriptions-for-action-stream';
import { replaceElement } from './replace-element';
import { setHandler } from './set-handler';

export function createApplyActionHandlers(selects: ActionSelect[]): (elements: ElementContent) => ElementContent {
  let activeSubscribes: ActionStreamSubscriptions[] = [];
  const handleActions = (elements: ElementContent) => {
    let newSubscribes: ActionStreamSubscriptions[] = [];
    const subscribableElements: Element[] = getSubscribableElements(getElements(elements));
    selects.forEach(
      (actionSelect) => {
        const subject = actionSelect.subject;
        const matches = getMatchingElements(subscribableElements, actionSelect.selector);
        matches.forEach(
          (selectedElement) => {
            const sendOnSelectStream = (action: Action) => {
              let aWithSource: Action & ActionSource = {...action, actionSource: selectedElement};
              if (aWithSource.type !== action.type) {
                // A native event, we can't clone that.
                // we'll see if we can mutate.
                action.actionSource = selectedElement;
                aWithSource = action as any;
              }
              subject.next(aWithSource);
            };

            const actionStreamProperty = getProperty(BuiltIn.ActionStream, selectedElement.properties);
            const actionStream: Observable<Action> | null = actionStreamProperty ? actionStreamProperty.value as Observable<Action> : null;
            if (actionStream) {
              let currentSubscribe: ActionStreamSubscriptions = getSubscriptionsForActionStream(activeSubscribes, actionStream);
              let newSubscribe: ActionStreamSubscriptions = getSubscriptionsForActionStream(newSubscribes, actionStream);
              const subSubscribe = getSubscriptionForSelect(currentSubscribe, actionSelect, sendOnSelectStream, actionStream);
              let index = newSubscribes.indexOf(newSubscribe);
              newSubscribe = {...newSubscribe, subscriptions: newSubscribe.subscriptions.concat([subSubscribe])};
              if (index === -1) {
                index = newSubscribes.length;
                newSubscribes.push(newSubscribe);
              } else {
                newSubscribes[index] = newSubscribe;
              }
            } else {
              let newElement: Element = setHandler(selectedElement, actionSelect, sendOnSelectStream);
              elements = replaceElement(elements, selectedElement, newElement);
              const index = subscribableElements.indexOf(selectedElement);
              // replacing if there are multiple selects for this element.
              subscribableElements[index] = newElement;
            }

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
