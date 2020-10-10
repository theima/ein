import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { TitleStateDescriptor } from '../../types-and-interfaces/config/descriptor/title.state-descriptor';

export function isTitleStateDescriptor(descriptor: StateDescriptor): descriptor is TitleStateDescriptor {
  // eslint-disable-next-line eqeqeq
  return descriptor.title != undefined;
}
