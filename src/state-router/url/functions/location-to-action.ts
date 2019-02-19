import { PathConfig } from '../types-and-interfaces/path.config';
import { Location } from 'history';
import { StateAction } from '../../core/types-and-interfaces/state-action';
import { Reason } from '../../core/types-and-interfaces/reason';
import { Code } from '../../core/types-and-interfaces/code';
import { State } from '../../core/types-and-interfaces/state';
import { locationToState } from './location-to-state';
import { Action, partial } from '../../../core';

export function locationToAction(configs: PathConfig[]): (location: Location) => Action {
  const getState: (location: Location) => State | null = partial(locationToState, configs);
  return (location: Location) => {
    const state: State | null = getState(location);
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
  };
}
