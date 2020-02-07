import { Action } from '../../../core';

export interface ActionHandler {
  for: string;
  handler: (action: Action) => void;
}
