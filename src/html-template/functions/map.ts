import { TemplateMapData } from '../types-and-interfaces/template-map-data';
import { TemplateMap } from '../types-and-interfaces/template-map';

export function map(name: string, map: TemplateMap): TemplateMapData {
  return {
    name,
    map
  };
}
