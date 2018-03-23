import { MapData } from '../types-and-interfaces/map-data';
import { Map } from '../types-and-interfaces/map';

export function map(name: string, map: Map): MapData {
  return {
    name,
    map
  };
}
