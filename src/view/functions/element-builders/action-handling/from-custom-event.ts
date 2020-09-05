import { Action } from '../../../../core';

export function fromCustomEvent(event: CustomEvent): Action {
  return {
      ...event.detail, type: event.type
    };
}
