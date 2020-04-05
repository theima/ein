import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { getStateHierarchy } from '../../get-state-hierarchy';

export function getStateDescriptorsEntered(newStateDescriptor: StateDescriptor, activeStateDescriptor?: StateDescriptor): StateDescriptor[] {
  let enterHierarchy: StateDescriptor[] = getStateHierarchy(newStateDescriptor);
  let leavingNames: StateDescriptor[] = activeStateDescriptor ? getStateHierarchy(activeStateDescriptor) : [];
  const entered: StateDescriptor[] = enterHierarchy.filter((s) => leavingNames.indexOf(s) === -1);
  return entered;
}
