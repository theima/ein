import { Stack } from '../../../../core';
import { StateParams } from '../../../types-and-interfaces/state-params';
import { StateDescriptor } from '../../../types-and-interfaces/state.descriptor';

export function createGetDescriptorStackForEnteredStates(statesEntered: (entering: StateDescriptor, leaving: StateDescriptor | null) => StateDescriptor[]) {
  const toDescriptorStack = (currentDescriptor: StateDescriptor | null, newDescriptor: StateDescriptor | null, params?: StateParams) => {
    if (!newDescriptor) {
      return new Stack([]);
    }
    return new Stack(
      statesEntered(newDescriptor, currentDescriptor)
        .map((d: StateDescriptor, index: number) => {
          return {
            name: d.name,
            params: (index === 0 && params) ? params : {}
          };
        }));
  };
  return toDescriptorStack;
}
