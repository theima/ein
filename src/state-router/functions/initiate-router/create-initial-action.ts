import { from, Observable } from 'rxjs';
import { StateAction } from '../../types-and-interfaces/actions/state-action';
import { TransitionAction } from '../../types-and-interfaces/actions/transition.action';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { State } from '../../types-and-interfaces/state/state';

export function createInitialAction(stateConfigs: StateDescriptor[]): Observable<TransitionAction> {
  const defaultConfig = stateConfigs[0];
  if (!defaultConfig) {
    return from([]);
  }
  const to: State = {
    name: defaultConfig.name,
    params: {}
  };
  const initialAction: TransitionAction = {
    type: StateAction.Transition,
    to
  };
  return from([initialAction]);
}
