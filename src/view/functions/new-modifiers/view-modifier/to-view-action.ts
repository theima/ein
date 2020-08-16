
import { Action } from '../../../../core';
import { ViewAction } from '../../../types-and-interfaces/view-action';
import { fromCustomEvent } from './from-custom-event';

export function toViewAction(name: string, action: Action): ViewAction {
  if (action instanceof CustomEvent) {
    action = fromCustomEvent(action);
  }
  return {
    action,
    target: name
  };
}
