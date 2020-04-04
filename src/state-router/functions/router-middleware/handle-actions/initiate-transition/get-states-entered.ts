import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { getStateHierarchy } from '../../get-state-hierarchy';

export function getStatesEntered(newStateDescriptor: StateDescriptor, activeStateDescriptor?: StateDescriptor): StateDescriptor[] {
  let enterHierarchy: StateDescriptor[] = getStateHierarchy(newStateDescriptor);
  let leavingNames: string[] = activeStateDescriptor ? getStateHierarchy(activeStateDescriptor).map((l) => l.name) : [];
  const entered: StateDescriptor[] = enterHierarchy.filter((s) => leavingNames.indexOf(s.name) === -1);
  if (entered.length) {
    return entered;
  }
  return [newStateDescriptor];
}
