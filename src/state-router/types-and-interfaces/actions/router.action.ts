import { State } from '../state/state';

export interface RouterAction {
  type: string;
  to: State;
}
