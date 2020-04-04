import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { getStateHierarchy } from './get-state-hierarchy';

export function isTransitionFromChildToAncestor(newStateDescriptor: StateDescriptor, activeStateDescriptor?: StateDescriptor): boolean {
  if (activeStateDescriptor) {
    let leavingHierarchy: StateDescriptor[] = getStateHierarchy(activeStateDescriptor);
    return leavingHierarchy.map((s) => (s as any).name ).includes(newStateDescriptor.name);
  }
  return false;
}
