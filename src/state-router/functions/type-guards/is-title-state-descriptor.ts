import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { TitleStateDescriptor } from '../../types-and-interfaces/config/descriptor/title.state-descriptor';

export function isTitleStateDescriptor(descriptor: StateDescriptor): descriptor is TitleStateDescriptor {
  // tslint:disable-next-line: triple-equals
  return descriptor.title != undefined;
}
