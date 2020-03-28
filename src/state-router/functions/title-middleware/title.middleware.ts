import { Action } from '../../../core';
import { State } from '../../types-and-interfaces/state/state';
import { isLastStateOfTransition } from '../is-last-state-of-transition';
import { isTransitionedAction } from '../router-middleware/type-guards/is-transitioned-action';
import { createTransitionFailedForTitleFailure } from './create-transition-failed-for-title-failure';

export function titleMiddleware(getTitle: (state: State) => string,
                                setTitle: (title: string) => void,
                                next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  return (following: (a: Action) => Action) => {
    return (a: Action) => {
      if (isTransitionedAction(a) && isLastStateOfTransition(a)) {
        let title: string;
        try {
          title = getTitle(a.to);
        } catch (error) {
          return next(createTransitionFailedForTitleFailure(a.to, error));
        }
        setTitle(title);

      }
      return following(a);
    };
  };
}
