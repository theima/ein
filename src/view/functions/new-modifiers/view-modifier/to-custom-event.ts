import { Action } from '../../../../core';

export function toCustomEvent(action: Action): CustomEvent{
  const detail = {...action};
  delete detail.type;
  return new CustomEvent(action.type, {detail});
}
