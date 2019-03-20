import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { InitiateExtenderResult } from '../types-and-interfaces/initiate-extender-result';

export function extender(name: string, initiateExtender: () => InitiateExtenderResult): ExtenderDescriptor {
  return {
    name, initiateExtender
  };
}
