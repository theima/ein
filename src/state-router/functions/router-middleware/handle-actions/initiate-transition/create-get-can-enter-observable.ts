import { Observable } from 'rxjs';
import { Action, Value } from '../../../../../core';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { Prevent } from '../../../../types-and-interfaces/config/prevent';
import { isTransitionFromChildToAncestor } from '../../is-transition-from-child-to-ancestor';
import { getStateDescriptorsEntered } from './get-state-descriptors-entered';
import { joinCanObservables } from './join-can-observables';
import { toSingleValueCan } from './to-single-value-can';

export function createGetCanEnterObservable(getCanEnter: (name: string) => (m: any) => Observable<boolean | Prevent | Action>) {
  return (model: Value, firstStateOfTransition: StateDescriptor, lastStateOfTransition: StateDescriptor, currentStateDescriptor?: StateDescriptor) => {

    let canEnterObservable: undefined | Observable<boolean | Prevent | Action>;
    const cameFromChild = isTransitionFromChildToAncestor(firstStateOfTransition, currentStateDescriptor);
    if (!cameFromChild) {
      const enteredStates = getStateDescriptorsEntered(lastStateOfTransition, currentStateDescriptor);
      const mappedCanEnters = enteredStates.reduce((cans: Array<Observable<boolean | Prevent| Action>>, d) => {
      const canEnter = getCanEnter(d.name);
      if (canEnter) {
        cans.push(canEnter(model));
      }
      return cans;
    }, []);
      canEnterObservable = joinCanObservables(
        mappedCanEnters
      );
    }
    return toSingleValueCan(canEnterObservable);
  };
}
