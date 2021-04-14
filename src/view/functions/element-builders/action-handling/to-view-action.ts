import { Action } from '../../../../core';
import { ViewAction } from '../../../types-and-interfaces/view-action';
import { fromCustomEvent } from './from-custom-event';

export function toViewAction(name: string, action: Action, detail: Record<string, unknown>): ViewAction {
  if (action instanceof CustomEvent) {
    action = fromCustomEvent(action);
  }
  return {
    ...detail,
    action,
    target: name,
  };
}
