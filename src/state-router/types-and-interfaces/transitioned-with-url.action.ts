import { TransitionedAction } from './transitioned.action';

export interface TransitionedWithPathAction extends TransitionedAction {
  url: string;
}
