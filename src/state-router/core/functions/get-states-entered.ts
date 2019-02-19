import { StateDescriptor } from '../types-and-interfaces/state.descriptor';
import { getStateHierarchy } from './get-state-hierarchy';
import { Dict, partial } from '../../../core';

export function getStatesEntered(states: Dict<StateDescriptor>, entering: StateDescriptor, leaving: StateDescriptor | null): StateDescriptor[] {
  const hierarchy: (s: StateDescriptor) => StateDescriptor[] = partial(getStateHierarchy, states);
  let enterHierarchy: StateDescriptor[] = hierarchy(entering);
  let leavingNames: string[] = leaving ? hierarchy(leaving).map(l => l.name) : [];
  const entered: StateDescriptor[] = enterHierarchy.filter(s => leavingNames.indexOf(s.name) === -1);
  if (entered.length) {
    return entered;
  }
  return [entering];
}
