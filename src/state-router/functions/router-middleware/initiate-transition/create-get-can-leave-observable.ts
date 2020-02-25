import { Observable } from 'rxjs';
import { Value } from '../../../../core';
import { Prevent } from '../../../types-and-interfaces/prevent';
import { StateDescriptor } from '../../../types-and-interfaces/state.descriptor';
import { joinCanObservables } from '../join-can-observables';

export function createGetCanLeaveObservable(statesLeft: (entering: StateDescriptor, leaving?: StateDescriptor) => StateDescriptor[],
                                            getCanLeave: (name: string) => ((m: any) => Observable<boolean | Prevent>) | undefined) {
  return (model: Value, currentStateDescriptor: undefined | StateDescriptor, lastStateOfTransition: StateDescriptor) => {
    let canLeaveObservable: undefined | Observable<boolean | Prevent>;
    const statesThatWillBeLeft = statesLeft(lastStateOfTransition, currentStateDescriptor);
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
    return canLeaveObservable;
  };
}
