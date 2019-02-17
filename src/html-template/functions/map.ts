import { ModelValueMapData } from '../types-and-interfaces/model-value-map-data';
import { ModelValueMap } from '../types-and-interfaces/model-value-map';

export function map(name: string, map: ModelValueMap): ModelValueMapData {
  return {
    name,
    map
  };
}
