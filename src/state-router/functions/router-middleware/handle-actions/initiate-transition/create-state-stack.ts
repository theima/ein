import { Stack } from '../../../../../core';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { StateParams } from '../../../../types-and-interfaces/state/state-params';

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
