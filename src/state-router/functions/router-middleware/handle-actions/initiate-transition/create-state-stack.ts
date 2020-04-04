import { Stack } from '../../../../../core';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { StateParams } from '../../../../types-and-interfaces/state/state-params';
import { getStateDescriptorsEntered } from './get-state-descriptors-entered';

export function createStateStack(newDescriptor: StateDescriptor, params: StateParams, currentDescriptor?: StateDescriptor) {
  const enteredStateDescriptors: StateDescriptor[] = getStateDescriptorsEntered(newDescriptor, currentDescriptor);
  // reverses the array because we'll enter the topmost state first.
  enteredStateDescriptors.reverse();
  const states = enteredStateDescriptors.map(
    (d: StateDescriptor, index: number) => {
      return {
        name: d.name,
        params: (index === 0 && params) ? params : {}
      };
    });
  return new Stack(states);
}
