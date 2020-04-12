import { PathStateDescriptor } from '../../types-and-interfaces/config/descriptor/path.state-descriptor';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';

export function isPathStateDescriptor(descriptor: StateDescriptor): descriptor is PathStateDescriptor {
  // tslint:disable-next-line: triple-equals
  return descriptor.path != undefined;
}
