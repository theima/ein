import { TransitioningAction } from '../../../types-and-interfaces/actions/transitioning.action';
import { createTransitioned } from '../creating-actions/create-transitioned';
import { Data } from '../../../types-and-interfaces/data';
import { Observable } from 'rxjs';
import { createDataObservable } from './create-data-observable';
import { StateAction } from '../../../types-and-interfaces/state-action';
import { Reason } from '../../../types-and-interfaces/reason';
import { Code } from '../../../types-and-interfaces/code';
import { Action, Dict } from '../../../../core';

export function sendTransitionedAction(next: (action: Action) => Action, stateData: Dict<Data>, model: any, transitioning: TransitioningAction): void {
  let observable: Observable<object> = createDataObservable(model, transitioning.to, stateData);
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
}