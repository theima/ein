import { Observable } from 'rxjs';
import { Value } from '../../../../../core';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { Prevent } from '../../../../types-and-interfaces/config/prevent';
import { toExistingProperties } from '../../descriptors/to-existing-properties';
import { getStatesLeft } from './get-states-left';
import { joinCanObservables } from './join-can-observables';
import { toSingleValueCan } from './to-single-value-can';

export function getCanLeaveObservable(model: Value, lastStateOfTransition: StateDescriptor, currentStateDescriptor?: StateDescriptor) {
  let canLeaveObservable: undefined | Observable<boolean | Prevent>;
  const leftDescriptors = getStatesLeft(lastStateOfTransition, currentStateDescriptor);
  const leftCans = toExistingProperties(leftDescriptors, 'canLeave').map((c) => c(model));
  if (leftCans.length) {
    canLeaveObservable = joinCanObservables(leftCans);
  }
  return toSingleValueCan(canLeaveObservable);
}
