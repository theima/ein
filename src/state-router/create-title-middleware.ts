import { Dict } from './types-and-interfaces/dict';
import { TitleConfig } from './types-and-interfaces/title.config';
import { TransitionedAction } from './types-and-interfaces/transitioned.action';
import { StateAction } from './types-and-interfaces/state-action';
import { stateToTitle } from './functions/state-to-title';
import { State } from './types-and-interfaces/state';
import { Reason } from './types-and-interfaces/reason';
import { Code } from './types-and-interfaces/code';
import { Action, Middleware } from '../model';

export function createTitleMiddleware(paths: Dict<TitleConfig>, setTitle: (title: string) => void): Middleware {
  const getTitle: (s: State) => (m: any) => string = stateToTitle(paths);
  return (next: (action: Action) => Action, value: () => any) => {
    return (following: (a: Action) => Action) => {
      return (a: Action) => {
        if (a.type === StateAction.Transitioned) {
          const transitioned: TransitionedAction = a as any;
          let title: string;
          try {
            title = getTitle(transitioned.to)(transitioned.to);
          } catch (error) {
            next({
              type: StateAction.TransitionFailed,
              to: transitioned.to,
              reason: Reason.CouldNotCreateTitle,
              code: Code.CouldNotCreateTitle,
              error
            } as any);
            return a;
          }
          let result: Action & { title: string } = following({...a, title} as any) as any;
          if (result.title) {
            setTitle(title);
          }
          return result;
        }
        return following(a);
      };
    };
  };
}
