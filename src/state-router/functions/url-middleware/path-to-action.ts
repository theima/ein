import { Action, partial } from '../../../core';
import { State } from '../../types-and-interfaces/state';
import { pathToState } from './path-to-state';
import { PathConfig } from '../../types-and-interfaces/path.config';
import { StateAction } from '../../types-and-interfaces/state-action';
import { Reason } from '../../types-and-interfaces/reason';
import { Code } from '../../types-and-interfaces/code';

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
