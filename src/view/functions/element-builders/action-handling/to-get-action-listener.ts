import { partial } from '../../../../core';
import { ActionHandler } from '../../../types-and-interfaces/to-element/action-handler';
import { GetActionListener } from '../../../types-and-interfaces/to-element/get-action-listener';

export function toGetActionListener(handler: ActionHandler): GetActionListener {
  return (name: string) => partial(handler, name);
}
