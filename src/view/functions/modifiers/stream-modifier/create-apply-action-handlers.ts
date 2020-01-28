import { Observable } from 'rxjs';
import { Action, partial } from '../../../../core';
import { BuiltIn } from '../../../types-and-interfaces/built-in';
import { Element } from '../../../types-and-interfaces/elements/element';
import { ElementContent } from '../../../types-and-interfaces/elements/element-content';
import { ActionSelect } from '../../../types-and-interfaces/select-action/action-select';
import { ActionSource } from '../../../types-and-interfaces/select-action/action-source';
import { ActionStreamSubscription } from '../../../types-and-interfaces/select-action/action-stream-subscription';
import { getElements } from '../../get-elements';
import { getProperty } from '../../get-property';
import { createSubscriptionForSelect } from './action-stream-subscribe/create-subscription-for-select';
import { matchToSubscription } from './action-stream-subscribe/match-to-subscription';
import { getMatchingElements } from './get-matching-elements';
import { getSubscribableElements } from './get-subscribable-elements';
import { replaceElement } from './replace-element';
import { setHandler } from './set-handler';

export function createApplyActionHandlers(selects: ActionSelect[]): (elements: ElementContent) => ElementContent {
  let activeSubscriptions: ActionStreamSubscription[] = [];
  const handleActions = (elements: ElementContent) => {
    let newSubscriptions: ActionStreamSubscription[] = [];
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
              const matcher = partial(matchToSubscription, actionStream, actionSelect);
              const index = activeSubscriptions.findIndex(matcher);
              const shouldCreateNew = index === -1;
              let subscription: ActionStreamSubscription;
              if (shouldCreateNew) {
                subscription = createSubscriptionForSelect(actionStream, actionSelect, sendOnSelectStream);
              } else {
                subscription = activeSubscriptions.splice(index, index+1)[0];
              }
              newSubscriptions.push(subscription);
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
    activeSubscriptions.forEach( (s)=> {
      s.subscription.unsubscribe();
    });
    activeSubscriptions = newSubscriptions;
    return elements;
  };
  return handleActions;
}
