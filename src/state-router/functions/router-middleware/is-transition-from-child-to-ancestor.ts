import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';

export function isTransitionFromChildToAncestor(getHierarchy: (s: StateDescriptor) => StateDescriptor[], newStateDescriptor: StateDescriptor, activeStateDescriptor?: StateDescriptor): boolean {
  if (activeStateDescriptor) {
    let leavingHierarchy: StateDescriptor[] = getHierarchy(activeStateDescriptor);
    return leavingHierarchy.map((s) => s.name).includes(newStateDescriptor.name);
  }
  return false;
}
