import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Value } from '../../../../../core';
import { StateAction } from '../../../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../../../types-and-interfaces/actions/transition-failed.action';
import { TransitioningAction } from '../../../../types-and-interfaces/actions/transitioning.action';
import { Code } from '../../../../types-and-interfaces/config/code';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { Reason } from '../../../../types-and-interfaces/config/reason';
import { createTransitioned } from '../../creating-actions/create-transitioned';
import { isTransitionFromChildToAncestor } from '../../is-transition-from-child-to-ancestor';
import { createDataObservable } from './create-data-observable';

export function createGetTransitioningObservable(getDescriptor: (name: string) => StateDescriptor | undefined) {
  return (model: Value, transitioning: TransitioningAction) => {
    const targetState = getDescriptor(transitioning.to.name) as StateDescriptor;
    const currentState = transitioning.from ? getDescriptor(transitioning.from.name) : undefined;
    const cameFromChild = isTransitionFromChildToAncestor(targetState, currentState);
    const data = cameFromChild ? {} : targetState.data || {};
    let observable: Observable<object> = createDataObservable(model, transitioning.to, data);
    return observable.pipe(
      map((data: object) => {
        return createTransitioned(transitioning, data);
      }),
      catchError((error: any) => {
        const failed: TransitionFailedAction = {
          type: StateAction.TransitionFailed,
          from: transitioning.from,
          to: transitioning.to,
          reason: Reason.CouldNotLoadData,
          code: Code.CouldNotLoadData,
          error
        };
        return from([failed]);
      }));
  };
}
