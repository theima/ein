import { partial } from '../../../../core';
import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { UrlAction } from '../../../types-and-interfaces/actions/url.action';
import { Code } from '../../../types-and-interfaces/config/code';
import { PathConfig } from '../../../types-and-interfaces/config/path.config';
import { Reason } from '../../../types-and-interfaces/config/reason';
import { State } from '../../../types-and-interfaces/state/state';
import { pathToState } from './path-to-state';

export function pathToAction(configs: PathConfig[], path: string, query: string = ''): UrlAction | TransitionFailedAction {
  const getState: (path: string, query?: string) => State | null = partial(pathToState, configs);
  const to: State | null = getState(path, query);
  if (!to) {
    return {
      type: StateAction.TransitionFailed,
      reason: Reason.NoStateForLocation,
      code: Code.NoStateForLocation
    };
  }
  return {
    type: StateAction.InitiateTransition,
    to,
    originatedFromLocationChange: true
  };
}
