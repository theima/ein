import { State } from '../state';

export interface RouterAction {
  type: string;
  to: State;
}
