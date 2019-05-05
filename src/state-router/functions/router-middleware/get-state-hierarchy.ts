import { StateDescriptor } from '../../types-and-interfaces/state.descriptor';
import { Dict, partial, fromDict } from '../../../core';

export function getStateHierarchy(states: Dict<StateDescriptor>, descriptor: StateDescriptor): StateDescriptor[] {
  const get: (name: string) => StateDescriptor | null = partial(fromDict, states);
  const parentList: (get: (name: string) => StateDescriptor, current: StateDescriptor, list: StateDescriptor[]) => StateDescriptor[] = (get: (name: string) => StateDescriptor, current: StateDescriptor, list: StateDescriptor[]) => {
    list.push(current);
    if (!current.parent) {
      return list;
    }
    return parentList(get, get(current.parent), list);
  };
  return parentList(get as (name: string) => StateDescriptor, descriptor, []); //we know it exists;
}
