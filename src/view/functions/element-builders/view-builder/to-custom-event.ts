import { Action } from '../../../../core';

export function toCustomEvent(action: Action): CustomEvent{
  const detail = {...action};
  return new CustomEvent(action.type.toLowerCase(), {detail});
}
