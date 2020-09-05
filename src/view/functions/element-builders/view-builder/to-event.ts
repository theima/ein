import { Action } from '../../../../core';
import { toCustomEvent } from './to-custom-event';

export function toEvent(action: Action): Event {
  return action instanceof Event ? action : toCustomEvent(action);
}
