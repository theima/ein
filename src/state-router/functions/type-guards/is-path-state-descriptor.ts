import { PathStateDescriptor } from '../../types-and-interfaces/config/descriptor/path.state-descriptor';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';

export function isPathStateDescriptor(
  descriptor: StateDescriptor
): descriptor is PathStateDescriptor {
  // eslint-disable-next-line eqeqeq
  return descriptor.path != undefined;
}
