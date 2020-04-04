import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { getStateHierarchy } from '../../get-state-hierarchy';

export function getStatesLeft(newStateDescriptor: StateDescriptor, activeStateDescriptor?: StateDescriptor): StateDescriptor[] {
  if (activeStateDescriptor) {
    let leavingHierarchy: StateDescriptor[] = getStateHierarchy(activeStateDescriptor);
    let enteringNames: StateDescriptor[] = getStateHierarchy(newStateDescriptor);
    const left: StateDescriptor[] = leavingHierarchy.filter(
      (s) => enteringNames.indexOf(s) === -1);
    if (left.length) {
      return left;
    }
  }
  return [];
}
