import { StateDescriptor } from '../types-and-interfaces/state.descriptor';
import { Dict } from '../types-and-interfaces/dict';
import { getStateHierarchy } from './get-state-hierarchy';

export function getStatesLeft(states: Dict<StateDescriptor>): (entering: StateDescriptor, leaving: StateDescriptor) => StateDescriptor[] {
  const hiearchy: (s: StateDescriptor) => StateDescriptor[] = getStateHierarchy(states);
  return (entering: StateDescriptor, leaving: StateDescriptor) => {
    let leavingHierarchy: StateDescriptor[] = hiearchy(leaving);
    let enteringNames: string[] = hiearchy(entering).map(l => l.name);
    const left: StateDescriptor[] = leavingHierarchy.filter(s => enteringNames.indexOf(s.name) === -1);
    if (left.length) {
      return left;
    }
    return [];
  };
}
