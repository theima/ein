import { Observable } from 'rxjs';
import { Value } from '../../../../../core';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { Prevent } from '../../../../types-and-interfaces/config/prevent';
import { toExistingProperties } from '../../descriptors/to-existing-properties';
import { getStateDescriptorsLeft } from './get-state-descriptors-left';
import { joinCanObservables } from './join-can-observables';

export function getCanLeaveObservable(
  model: Value,
  lastStateOfTransition: StateDescriptor,
  currentStateDescriptor?: StateDescriptor
): Observable<boolean | Prevent> {
  const leftDescriptors = getStateDescriptorsLeft(lastStateOfTransition, currentStateDescriptor);
  const leftCans = toExistingProperties(leftDescriptors, 'canLeave').map((c) => c(model));
  return joinCanObservables(leftCans);
}
