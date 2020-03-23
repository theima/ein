import { Dict, fromDict, partial } from '../../../core';
import { StateDescriptor } from '../../types-and-interfaces/state.descriptor';

export function getStateHierarchy(states: Dict<StateDescriptor>, descriptor: StateDescriptor): StateDescriptor[] {
  const get: (name: string) => StateDescriptor | undefined = partial(fromDict, states);
  const parentList: (get: (name: string) => StateDescriptor, current: StateDescriptor, list: StateDescriptor[]) => StateDescriptor[] = (get: (name: string) => StateDescriptor, current: StateDescriptor, list: StateDescriptor[]) => {
    list.push(current);
    if (!current.parent) {
      return list;
    }
    return parentList(get, get(current.parent), list);
  };
  return parentList(get as (name: string) => StateDescriptor, descriptor, []); // we know it exists;
}
