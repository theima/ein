import { StateDescriptor } from '../../types-and-interfaces/state.descriptor';
import { getStateHierarchy } from './get-state-hierarchy';
import { Dict, partial } from '../../../core';

export function getStatesLeft(states: Dict<StateDescriptor>, entering: StateDescriptor, leaving: StateDescriptor | null): StateDescriptor[] {
  if (leaving) {
    const hierarchy: (s: StateDescriptor) => StateDescriptor[] = partial(getStateHierarchy, states);
    let leavingHierarchy: StateDescriptor[] = hierarchy(leaving);
    let enteringNames: string[] = hierarchy(entering).map(l => l.name);
    const left: StateDescriptor[] = leavingHierarchy.filter(s => enteringNames.indexOf(s.name) === -1);
    if (left.length) {
      return left;
    }
  }
  return [];
}
