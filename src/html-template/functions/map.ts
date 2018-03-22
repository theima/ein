import { MapData } from '../types-and-interfaces/map-data';
import { Map } from '../';

export function map(name: string, map: Map): MapData {
  return {
    name,
    map
  };
}
