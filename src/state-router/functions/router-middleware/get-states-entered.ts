import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';

export function getStatesEntered(getHierarchy: (s: StateDescriptor) => StateDescriptor[], newStateDescriptor: StateDescriptor, activeStateDescriptor?: StateDescriptor): StateDescriptor[] {
  let enterHierarchy: StateDescriptor[] = getHierarchy(newStateDescriptor);
  let leavingNames: string[] = activeStateDescriptor ? getHierarchy(activeStateDescriptor).map((l) => l.name) : [];
  const entered: StateDescriptor[] = enterHierarchy.filter((s) => leavingNames.indexOf(s.name) === -1);
  if (entered.length) {
    return entered;
  }
  return [newStateDescriptor];
}
