import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';

export function getStatesLeft(getHierarchy: (s: StateDescriptor) => StateDescriptor[], newStateDescriptor: StateDescriptor, activeStateDescriptor?: StateDescriptor): StateDescriptor[] {
  if (activeStateDescriptor) {
    let leavingHierarchy: StateDescriptor[] = getHierarchy(activeStateDescriptor);
    let enteringNames: string[] = getHierarchy(newStateDescriptor).map((l) => l.name);
    const left: StateDescriptor[] = leavingHierarchy.filter((s) => enteringNames.indexOf(s.name) === -1);
    if (left.length) {
      return left;
    }
  }
  return [];
}
