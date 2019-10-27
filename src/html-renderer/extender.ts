import { ExtenderDescriptor } from './types-and-interfaces/extender.descriptor';
import { InitiateExtender } from './types-and-interfaces/initiate-extender';

export function extender(name: string, initiateExtender: InitiateExtender): ExtenderDescriptor {
  return {
    name, initiateExtender
  };
}
