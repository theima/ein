import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { getStateHierarchy } from '../../get-state-hierarchy';

export function getStatesLeft(newStateDescriptor: StateDescriptor, activeStateDescriptor?: StateDescriptor): StateDescriptor[] {
  if (activeStateDescriptor) {
    let leavingHierarchy: StateDescriptor[] = getStateHierarchy(activeStateDescriptor);
    let enteringNames: string[] = getStateHierarchy(newStateDescriptor).map((l) => l.name);
    const left: StateDescriptor[] = leavingHierarchy.filter((s) => enteringNames.indexOf(s.name) === -1);
    if (left.length) {
      return left;
    }
  }
  return [];
}
