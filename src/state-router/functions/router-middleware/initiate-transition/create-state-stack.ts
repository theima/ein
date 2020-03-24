import { Stack } from '../../../../core';
import { StateParams } from '../../../types-and-interfaces/state-params';
import { StateDescriptor } from '../../../types-and-interfaces/state.descriptor';

export function createGetDescriptorStackForEnteredStates(statesEntered: (entering: StateDescriptor, leaving?: StateDescriptor) => StateDescriptor[]) {
  const toDescriptorStack = (newDescriptor: StateDescriptor, params: StateParams, currentDescriptor?: StateDescriptor) => {
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
