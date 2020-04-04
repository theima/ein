import { RuleDescriptor } from '../../types-and-interfaces/config/descriptor/rule.descriptor';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';

export function isStateDescriptor(descriptor: StateDescriptor | RuleDescriptor): descriptor is StateDescriptor {
  return !!(descriptor as StateDescriptor).name;
}
