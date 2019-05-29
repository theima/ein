import { ModelValueMapDescriptor } from '../types-and-interfaces/model-value-map-descriptor';
import { ModelValueMap } from '../types-and-interfaces/model-value-map';

export function map(name: string, map: ModelValueMap): ModelValueMapDescriptor {
  return {
    name,
    map
  };
}
