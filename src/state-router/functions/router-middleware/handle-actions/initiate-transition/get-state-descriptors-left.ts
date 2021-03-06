import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { getStateDescriptorList } from './get-state-descriptor-list';

export function getStateDescriptorsLeft(
  newStateDescriptor: StateDescriptor,
  activeStateDescriptor?: StateDescriptor
): StateDescriptor[] {
  const activeList: StateDescriptor[] = activeStateDescriptor ? getStateDescriptorList(activeStateDescriptor) : [];
  const newList: StateDescriptor[] = getStateDescriptorList(newStateDescriptor);
  const left: StateDescriptor[] = activeList.filter((s) => newList.indexOf(s) === -1);
  return left;
}
