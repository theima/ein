import { Extender } from './types-and-interfaces/extender/extender';
import { InitiateExtender } from './types-and-interfaces/extender/initiate-extender';

export function extender(name: string, initiate: InitiateExtender): Extender {
  return {
    name, initiate
  };
}
