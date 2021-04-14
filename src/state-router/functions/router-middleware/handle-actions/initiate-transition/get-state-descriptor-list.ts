import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';

export function getStateDescriptorList(descriptor: StateDescriptor): StateDescriptor[] {
  const parentList: (current: StateDescriptor, list: StateDescriptor[]) => StateDescriptor[] = (
    current: StateDescriptor,
    list: StateDescriptor[]
  ) => {
    list.unshift(current);
    if (!current.parent) {
      return list;
    }
    return parentList(current.parent, list);
  };
  return parentList(descriptor, []);
}
