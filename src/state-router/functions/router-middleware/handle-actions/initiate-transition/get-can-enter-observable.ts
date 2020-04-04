import { Observable } from 'rxjs';
import { Action, Value } from '../../../../../core';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { Prevent } from '../../../../types-and-interfaces/config/prevent';
import { toExistingProperties } from '../../descriptors/to-existing-properties';
import { isTransitionFromChildToAncestor } from '../../is-transition-from-child-to-ancestor';
import { getStateDescriptorsEntered } from './get-state-descriptors-entered';
import { joinCanObservables } from './join-can-observables';
import { toSingleValueCan } from './to-single-value-can';

export function getCanEnterObservable(model: Value, firstStateOfTransition: StateDescriptor, lastStateOfTransition: StateDescriptor, currentStateDescriptor?: StateDescriptor): Observable<boolean | Action | Prevent> {
    let canEnterObservable: undefined | Observable<boolean | Prevent | Action>;
    const cameFromChild = isTransitionFromChildToAncestor(firstStateOfTransition, currentStateDescriptor);
    if (!cameFromChild) {
      const enteredDescriptors = getStateDescriptorsEntered(lastStateOfTransition, currentStateDescriptor);
      const enteredCans = toExistingProperties(enteredDescriptors, 'canEnter').map((c) => c(model));
      canEnterObservable = joinCanObservables(enteredCans);
    }
    return toSingleValueCan(canEnterObservable);
}
