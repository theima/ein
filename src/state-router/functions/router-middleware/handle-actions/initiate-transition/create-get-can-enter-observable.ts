import { Observable } from 'rxjs';
import { Action, Value } from '../../../../../core';
import { CanEnter } from '../../../../types-and-interfaces/config/can-enter';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { Prevent } from '../../../../types-and-interfaces/config/prevent';
import { enteredRules } from '../../entered-rules';
import { joinCanObservables } from '../../join-can-observables';
import { toSingleValueCan } from './to-single-value-can';

export function createGetCanEnterObservable(enteredFromChildState: (entering: StateDescriptor, leaving?: StateDescriptor) => boolean,
                                            getCanEnter: (name: string) => (m: any) => Observable<boolean | Prevent | Action>) {
  return (model: Value, firstStateOfTransition: StateDescriptor, lastStateOfTransition: StateDescriptor, currentStateDescriptor?: StateDescriptor) => {

    let canEnterObservable: undefined | Observable<boolean | Prevent | Action>;
    const cameFromChild = enteredFromChildState(firstStateOfTransition, currentStateDescriptor);
    if (!cameFromChild) {
      const rules = enteredRules(lastStateOfTransition, currentStateDescriptor);
      const firstCanEnter = getCanEnter(firstStateOfTransition.name);
      if (firstCanEnter) {
        rules.push(firstCanEnter);
      }
      canEnterObservable = joinCanObservables(
        rules.map((c: CanEnter) => {
          return c(model);
        })
      );
    }
    return toSingleValueCan(canEnterObservable);
  };
}
