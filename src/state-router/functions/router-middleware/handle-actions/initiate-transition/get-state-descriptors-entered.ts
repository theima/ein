import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { getStateDescriptorList } from './get-state-descriptor-list';

export function getStateDescriptorsEntered(
  newStateDescriptor: StateDescriptor,
  activeStateDescriptor?: StateDescriptor
): StateDescriptor[] {
  const activeList: StateDescriptor[] = activeStateDescriptor ? getStateDescriptorList(activeStateDescriptor) : [];
  const newList: StateDescriptor[] = getStateDescriptorList(newStateDescriptor);
  const entered: StateDescriptor[] = newList.filter((s) => activeList.indexOf(s) === -1);
  return entered;
}
