import { Action, partial } from '../../../../core';
import { Code } from '../../../types-and-interfaces/code';
import { PathConfig } from '../../../types-and-interfaces/path.config';
import { Reason } from '../../../types-and-interfaces/reason';
import { State } from '../../../types-and-interfaces/state';
import { StateAction } from '../../../types-and-interfaces/state-action';
import { pathToState } from './path-to-state';

export function pathToAction(configs: PathConfig[], path: string, query: string = ''): Action {
  const getState: (path: string, query?: string) => State | null = partial(pathToState, configs);
  const state: State | null = getState(path, query);
  if (!state) {
    return {
      type: StateAction.TransitionFailed,
      reason: Reason.NoStateForLocation,
      code: Code.NoStateForLocation
    };
  }
  return {
    type: StateAction.Transition,
    ...state
  };
}
