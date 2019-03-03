import { StateDescriptor } from '../../types-and-interfaces/state.descriptor';

export function getStatesLeft(getHierarchy: (s: StateDescriptor) => StateDescriptor[], entering: StateDescriptor, leaving: StateDescriptor | null): StateDescriptor[] {
  if (leaving) {
    let leavingHierarchy: StateDescriptor[] = getHierarchy(leaving);
    let enteringNames: string[] = getHierarchy(entering).map(l => l.name);
    const left: StateDescriptor[] = leavingHierarchy.filter(s => enteringNames.indexOf(s.name) === -1);
    if (left.length) {
      return left;
    }
  }
  return [];
}
