import { Stack } from '../../../../../core';
import { RuleDescriptor } from '../../../../types-and-interfaces/config/descriptor/rule.descriptor';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { StateParams } from '../../../../types-and-interfaces/state/state-params';
import { isStateDescriptor } from '../../../type-guards/is-state-descriptor';
import { getStatesEntered } from './get-states-entered';

export function createStateStack(newDescriptor: StateDescriptor, params: StateParams, currentDescriptor?: StateDescriptor) {
  const enteredDescriptors: Array<StateDescriptor | RuleDescriptor> = getStatesEntered(newDescriptor, currentDescriptor);
  const enteredStateDescriptors = enteredDescriptors.filter(isStateDescriptor);
  const states = enteredStateDescriptors.map(
    (d: StateDescriptor, index: number) => {
      return {
        name: d.name,
        params: (index === 0 && params) ? params : {}
      };
    });
  return new Stack(states);
}
