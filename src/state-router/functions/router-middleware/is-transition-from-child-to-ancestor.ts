import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';

export function isTransitionFromChildToAncestor(getHierarchy: (s: StateDescriptor) => StateDescriptor[], entering: StateDescriptor, leaving?: StateDescriptor): boolean {
  if (leaving) {
    let leavingHierarchy: StateDescriptor[] = getHierarchy(leaving);
    return leavingHierarchy.map((s) => s.name).includes(entering.name);
  }
  return false;
}
