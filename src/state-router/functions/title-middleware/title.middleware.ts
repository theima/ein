import { Action, Dict, partial } from '../../../core';
import { Code } from '../../types-and-interfaces/code';
import { Reason } from '../../types-and-interfaces/reason';
import { State } from '../../types-and-interfaces/state';
import { StateAction } from '../../types-and-interfaces/state-action';
import { TitleConfig } from '../../types-and-interfaces/title.config';
import { isTransitionedAction } from '../router-middleware/type-guards/is-transitioned-action';
import { stateToTitle } from './state-to-title';

export function titleMiddleware(paths: Dict<TitleConfig>, setTitle: (title: string) => void, next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  const getTitle: (s: State) => (m: any) => string = partial(stateToTitle, paths);
  return (following: (a: Action) => Action) => {
    return (a: Action) => {
      if (isTransitionedAction(a)) {
        const isLastStateOfTransition = a.remainingStates.count === 0;
        if (isLastStateOfTransition) {
        let title: string;
        try {
          title = getTitle(a.to)(a.to);
        } catch (error) {
          next({
            type: StateAction.TransitionFailed,
            to: a.to,
            reason: Reason.CouldNotCreateTitle,
            code: Code.CouldNotCreateTitle,
            error
          } as any);
          return a;
        }
        setTitle(title);
        return following(a);
        }
      }
      return following(a);
    };
  };
}
