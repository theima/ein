import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';

export function extender(name: string, extender: (element: Element) => void): ExtenderDescriptor {
  return {
    name, extender
  };
}
