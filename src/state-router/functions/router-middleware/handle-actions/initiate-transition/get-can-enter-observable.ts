import { Observable } from 'rxjs';
import { Action, Value } from '../../../../../core';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { Prevent } from '../../../../types-and-interfaces/config/prevent';
import { toExistingProperties } from '../../descriptors/to-existing-properties';
import { getStateDescriptorsEntered } from './get-state-descriptors-entered';
import { joinCanObservables } from './join-can-observables';

export function getCanEnterObservable(
  model: Value,
  lastStateOfTransition: StateDescriptor,
  currentStateDescriptor?: StateDescriptor
): Observable<boolean | Action | Prevent> {
  const enteredDescriptors = getStateDescriptorsEntered(
    lastStateOfTransition,
    currentStateDescriptor
  );
  const enteredCans = toExistingProperties(
    enteredDescriptors,
    'canEnter'
  ).map((c) => c(model));
  return joinCanObservables(enteredCans);
}
