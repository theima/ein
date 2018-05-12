import { TransitioningAction } from '../types-and-interfaces/transitioning.action';
import { createTransitioned } from './create-transitioned';
import { Data } from '../types-and-interfaces/data';
import { Observable } from 'rxjs/Observable';
import { createDataObservable } from './create-data-observable';
import { StateAction } from '../types-and-interfaces/state-action';
import { Reason } from '../types-and-interfaces/reason';
import { Code } from '../types-and-interfaces/code';
import { Action } from '../../model';
import { Dict } from '../../core';

export function sendTransitioned(stateData: Dict<Data>, model: any, next: (action: Action) => Action): (transitioning: TransitioningAction) => void {
  return (transitioning: TransitioningAction) => {
    let observable: Observable<object> = createDataObservable(model, transitioning.to)(stateData);
    observable.subscribe((data: object) => {
      next(createTransitioned(transitioning, data));
    }, (error: any) => {
      next({
        type: StateAction.TransitionFailed,
        from: transitioning.from,
        to: transitioning.to,
        reason: Reason.CouldNotLoadData,
        code: Code.CouldNotLoadData,
        error
      } as any);
    });
  };
}
