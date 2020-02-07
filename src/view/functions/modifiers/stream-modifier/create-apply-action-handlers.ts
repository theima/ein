import { Observable } from 'rxjs';
import { Action, partial } from '../../../../core';
import { BuiltIn } from '../../../types-and-interfaces/built-in';
import { Element } from '../../../types-and-interfaces/elements/element';
import { ElementContent } from '../../../types-and-interfaces/elements/element-content';
import { ActionSelect } from '../../../types-and-interfaces/select-action/action-select';
import { ActionStreamSubscription } from '../../../types-and-interfaces/select-action/action-stream-subscription';
import { getProperty } from '../../get-property';
import { createSubscriptionForSelect } from './action-stream-subscribe/create-subscription-for-select';
import { matchToSubscription } from './action-stream-subscribe/match-to-subscription';
import { getMatchingElements } from './get-matching-elements';
import { getSubscribableElements } from './get-subscribable-elements';
import { replaceElement } from './replace-element';
import { setActionSource } from './set-action-source';
import { setHandler } from './set-handler';

export function createApplyActionHandlers(selects: ActionSelect[]): (elements: ElementContent) => ElementContent {
  let activeSubscriptions: ActionStreamSubscription[] = [];
  const handleActions = (elements: ElementContent) => {
    let newSubscriptions: ActionStreamSubscription[] = [];
    const subscribableElements: Element[] = getSubscribableElements(elements);
    selects.forEach(
      (actionSelect) => {
        const subject = actionSelect.subject;
        const elementsMatchingSelector = getMatchingElements(subscribableElements, actionSelect.selector);
        elementsMatchingSelector.forEach(
          (matchingElement) => {
            const sendOnSelectStream = (action: Action) => {
              subject.next(setActionSource(action, matchingElement));
            };

            const actionStreamProperty = getProperty(BuiltIn.ActionStream, matchingElement.properties);
            const actionStream: Observable<Action> | null = actionStreamProperty ? actionStreamProperty.value as Observable<Action> : null;
            if (actionStream) {
              const matcher = partial(matchToSubscription, actionStream, actionSelect);
              const index = activeSubscriptions.findIndex(matcher);
              const shouldCreateNew = index === -1;
              let subscription: ActionStreamSubscription;
              if (shouldCreateNew) {
                subscription = createSubscriptionForSelect(actionStream, actionSelect, sendOnSelectStream);
              } else {
                subscription = activeSubscriptions.splice(index, index + 1)[0];
              }
              newSubscriptions.push(subscription);
            } else {
              let newElement: Element = setHandler(matchingElement, actionSelect, sendOnSelectStream);
              elements = replaceElement(elements, matchingElement, newElement);
              const index = subscribableElements.indexOf(matchingElement);
              // replacing if there are multiple selects for this element.
              subscribableElements[index] = newElement;
            }

          }
        );
      }
    );
    activeSubscriptions.forEach((s) => {
      s.unsubscribe();
    });
    activeSubscriptions = newSubscriptions;
    return elements;
  };
  return handleActions;
}
