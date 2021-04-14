import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { StateConfig } from '../../types-and-interfaces/config/state-config';

export function toStateDescriptor(config: StateConfig, parent?: StateDescriptor): StateDescriptor {
  const descriptor: StateDescriptor = {
    name: config.name,
    title: config.title,
    path: config.path,
    data: config.data,
    canEnter: config.canEnter,
    canLeave: config.canLeave,
    parent,
  };
  if (descriptor.path && !descriptor.path.startsWith('/')) {
    descriptor.path = '/' + descriptor.path;
  }
  if (descriptor.path && parent?.path) {
    descriptor.path = parent.path + descriptor.path;
  }
  return descriptor;
}
