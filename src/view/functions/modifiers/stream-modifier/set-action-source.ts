import { Action } from '../../../../core';
import { Element } from '../../../types-and-interfaces/elements/element';
import { ActionSource } from '../../../types-and-interfaces/select-action/action-source';

export function setActionSource(action: Action, actionSource: Element): Action & ActionSource {
  let aWithSource: Action & ActionSource = {...action, actionSource};
  if (aWithSource.type !== action.type) {
    // A native event, we can't clone that.
    // we'll see if we can mutate.
    action.actionSource = actionSource;
    aWithSource = action as any;
  }
  return aWithSource;
}
