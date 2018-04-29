import { fromDict } from './from-dict';
import { StateDescriptor } from '../types-and-interfaces/state.descriptor';
import { Dict } from '../types-and-interfaces/dict';

export function getStateHierarchy(states: Dict<StateDescriptor>): (d: StateDescriptor) => StateDescriptor[] {
  const get: (name: string) => StateDescriptor = fromDict(states) as (name: string) => StateDescriptor;
  const parentList: (get: (name: string) => StateDescriptor, current: StateDescriptor, list: StateDescriptor[]) => StateDescriptor[] = (get: (name: string) => StateDescriptor, current: StateDescriptor, list: StateDescriptor[]) => {
    list.push(current);
    if (!current.parent) {
      return list;
    }
    return parentList(get, get(current.parent), list) as StateDescriptor[];
  };
  return (descriptor: StateDescriptor) => {
    return parentList(get, descriptor, []);
  };
}
