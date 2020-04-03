import { Stack } from '../../../../../core';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { StateParams } from '../../../../types-and-interfaces/state/state-params';
import { getStatesEntered } from '../../get-states-entered';

export function createStateStack(newDescriptor: StateDescriptor, params: StateParams, currentDescriptor?: StateDescriptor) {
  const states = getStatesEntered(newDescriptor, currentDescriptor)
    .map((d: StateDescriptor, index: number) => {
      return {
        name: d.name,
        params: (index === 0 && params) ? params : {}
      };
    });
  return new Stack(states);
}
