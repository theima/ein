import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Dict } from '../../../../core';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { TransitioningAction } from '../../../types-and-interfaces/actions/transitioning.action';
import { Code } from '../../../types-and-interfaces/code';
import { Data } from '../../../types-and-interfaces/data';
import { Reason } from '../../../types-and-interfaces/reason';
import { StateAction } from '../../../types-and-interfaces/state-action';
import { StateDescriptor } from '../../../types-and-interfaces/state.descriptor';
import { createTransitioned } from '../creating-actions/create-transitioned';
import { createDataObservable } from './create-data-observable';

export function createGetTransitionedObservable(getData: (name: string) => Dict<Data>,
                                                enteredFromChildState: (entering: StateDescriptor,
                                                                        leaving?: StateDescriptor) => boolean) {
  return (model: any, transitioning: TransitioningAction, to: StateDescriptor, fromState?: StateDescriptor) => {
    const cameFromChild = enteredFromChildState(to, fromState);
    const data = cameFromChild ? {} : getData(transitioning.to.name);
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
