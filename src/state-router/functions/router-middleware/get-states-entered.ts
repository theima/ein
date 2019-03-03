import { StateDescriptor } from '../../types-and-interfaces/state.descriptor';

export function getStatesEntered(getHierarchy: (s: StateDescriptor) => StateDescriptor[], entering: StateDescriptor, leaving: StateDescriptor | null): StateDescriptor[] {
  let enterHierarchy: StateDescriptor[] = getHierarchy(entering);
  let leavingNames: string[] = leaving ? getHierarchy(leaving).map(l => l.name) : [];
  const entered: StateDescriptor[] = enterHierarchy.filter(s => leavingNames.indexOf(s.name) === -1);
  if (entered.length) {
    return entered;
  }
  return [entering];
}
