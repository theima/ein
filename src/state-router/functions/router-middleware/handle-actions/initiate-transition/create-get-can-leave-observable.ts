import { Observable } from 'rxjs';
import { Value } from '../../../../../core';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { Prevent } from '../../../../types-and-interfaces/config/prevent';
import { getStatesLeft } from '../../get-states-left';
import { joinCanObservables } from '../../join-can-observables';
import { toSingleValueCan } from './to-single-value-can';

export function createGetCanLeaveObservable(getCanLeave: (name: string) => ((m: any) => Observable<boolean | Prevent>) | undefined) {
  return (model: Value, lastStateOfTransition: StateDescriptor, currentStateDescriptor?: StateDescriptor) => {
    let canLeaveObservable: undefined | Observable<boolean | Prevent>;
    const statesThatWillBeLeft = getStatesLeft(lastStateOfTransition, currentStateDescriptor);
    const allCanLeaves = statesThatWillBeLeft.reduce((cans: Array<Observable<boolean | Prevent>>, d) => {
      const canLeave = getCanLeave(d.name);
      if (canLeave) {
        cans.push(canLeave(model));
      }
      return cans;
    }, []);
    if (allCanLeaves.length) {
      canLeaveObservable = joinCanObservables(allCanLeaves);
    }
    return toSingleValueCan(canLeaveObservable);
  };
}
