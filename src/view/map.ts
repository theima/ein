import { ValueMap } from './types-and-interfaces/value-map';
import { ViewMap } from './types-and-interfaces/view-map';

export function map(name: string, map: ValueMap): ViewMap {
  return {
    name: name.toLowerCase(),
    map,
  };
}
