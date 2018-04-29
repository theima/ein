import { StateDescriptor } from '../types-and-interfaces/state.descriptor';
import { Dict } from '../types-and-interfaces/dict';
import { getStateHierarchy } from './get-state-hierarchy';

export function getStatesEntered(states: Dict<StateDescriptor>): (entering: StateDescriptor, leaving: StateDescriptor | null) => StateDescriptor[] {
  const hiearchy: (s: StateDescriptor) => StateDescriptor[] = getStateHierarchy(states);
  return (entering: StateDescriptor, leaving: StateDescriptor | null) => {
    let enterHierarchy: StateDescriptor[] = hiearchy(entering);
    let leavingNames: string[] = leaving ? hiearchy(leaving).map(l => l.name) : [];
    const entered: StateDescriptor[] = enterHierarchy.filter(s => leavingNames.indexOf(s.name) === -1);
    if (entered.length) {
      return entered;
    }
    return [entering];
  };
}
