import { Map } from '../';
import { MapData } from '../types-and-interfaces/map-data';

export function map(name: string, map: Map): MapData {
  return {
    name,
    map
  };
}
