import { RuleDescriptor } from '../../types-and-interfaces/config/descriptor/rule.descriptor';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { StateConfig } from '../../types-and-interfaces/config/state.config';

export function toStateDescriptor(config: StateConfig, parent?: StateDescriptor, rule?: RuleDescriptor): StateDescriptor {
  let descriptor: StateDescriptor = {
    name: config.name,
    title: config.title,
    path: config.path,
    data: config.data,
    canEnter: config.canEnter,
    canLeave: config.canLeave,
    rule,
    parent
  };
  if (descriptor.path && parent) {
    descriptor.path = parent.path + descriptor.path;
  }
  return descriptor;
}
