import { ValueMapDescriptor } from '../types-and-interfaces/value-map-descriptor';
import { ValueMap } from '../types-and-interfaces/value-map';

export function map(name: string, map: ValueMap): ValueMapDescriptor {
  return {
    name,
    map
  };
}
