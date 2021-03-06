import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Value } from '../../../../../core';
import { StateAction } from '../../../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../../../types-and-interfaces/actions/transition-failed.action';
import { TransitionedAction } from '../../../../types-and-interfaces/actions/transitioned.action';
import { TransitioningAction } from '../../../../types-and-interfaces/actions/transitioning.action';
import { Code } from '../../../../types-and-interfaces/config/code';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { Reason } from '../../../../types-and-interfaces/config/reason';
import { createTransitioned } from '../../creating-actions/create-transitioned';
import { createDataObservable } from './create-data-observable';

export function createGetTransitioningObservable(
  getDescriptor: (name: string) => StateDescriptor | undefined
): (model: Value, transitioning: TransitioningAction) => Observable<TransitionedAction | TransitionFailedAction> {
  return (model: Value, transitioning: TransitioningAction) => {
    const targetState = getDescriptor(transitioning.to.name) as StateDescriptor;
    const data = targetState.data || {};
    const observable: Observable<object> = createDataObservable(model, transitioning.to, data);
    return observable.pipe(
      map((dataItem: object) => {
        return createTransitioned(transitioning, dataItem);
      }),
      catchError((error: unknown) => {
        const failed: TransitionFailedAction = {
          type: StateAction.TransitionFailed,
          from: transitioning.from,
          to: transitioning.to,
          reason: Reason.CouldNotLoadData,
          code: Code.CouldNotLoadData,
          error,
        };
        return from([failed]);
      })
    );
  };
}
