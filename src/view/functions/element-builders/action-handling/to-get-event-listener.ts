import { partial } from '../../../../core';
import { ActionHandler } from '../../../types-and-interfaces/action-handler';
import { GetEventListener } from '../../../types-and-interfaces/get-event-listener';

export function toGetEventListener(handler: ActionHandler): GetEventListener {
  return (name: string) => partial(handler, name);
}
