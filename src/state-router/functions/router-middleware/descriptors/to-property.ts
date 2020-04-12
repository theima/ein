import { StateDescriptor } from '../../../types-and-interfaces/config/descriptor/state.descriptor';

export function toProperty<k extends keyof StateDescriptor>(descriptor: StateDescriptor, property: k): StateDescriptor[k] | undefined {
  return descriptor[property];
}
