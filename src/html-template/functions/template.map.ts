import { Template } from '../types-and-interfaces/template';
import { Dict, get, trimArray } from '../../core/';
import { parseTemplateParameter } from './parse-template-parameter';
import { getModel } from './get-model';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { MapData } from '../types-and-interfaces/map-data';

export function templateMap(maps: Dict<MapData>, template: Template): (m: object) =>  object | string | number | boolean {
  return (model: object) => {
    let parts = trimArray(template.split(BuiltIn.MapSeparator));
    const initialValue: object | string | number | boolean = getModel(model, parts.shift() as string);
    return parts.reduce((value: object | string | number | boolean, part: string, index: number) => {
        const mapAndParameters = trimArray(part.split(BuiltIn.ParameterSeparator));
        const mapName = mapAndParameters[0];
        const mapData: MapData = get(maps, mapName);
        const parameters = mapAndParameters.slice(1).map((param) => {
          const result = parseTemplateParameter(model, param);
          if (result === null) {
            throw new Error('Could not parse parameter\'' + param + '\' for \'' + mapName + '\'');
          }
          return result;
        });
        if (!mapData) {
          throw new Error('Could not find map \'' + mapName + '\'.');
        }
        return mapData.map(value, ...parameters);
      }
      , initialValue);
  };
}
