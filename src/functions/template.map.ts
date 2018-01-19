import {Template} from '../types-and-interfaces/template';
import {Map, MapData} from '../';
import {Dict} from '../types-and-interfaces/dict';
import {get} from '../core/get';
import {trimArray} from '../core/trim-array';
import {parseTemplateParameter} from './parse-template-parameter';

export function templateMap(maps: Dict<MapData>): (template: Template) => (m: object) => string {
  return (template: Template) => {
    return (model: object) => {
      let parts = trimArray(template.split('=>'));
      const initialValue: object | string | number | boolean = get(model, parts.shift() as string);
      return parts.reduce((value: object | string | number | boolean, part: string, index: number) => {
          const mapAndParameters = trimArray(part.split(':'));
          const mapName = mapAndParameters[0];
          const mapData: MapData = get(maps, mapName);
          const parameters = mapAndParameters.slice(1).map((param) => {
            const result = parseTemplateParameter(model, param);
            if (result === null) {
              throw new Error('Could not parse parameter\'' + param + '\ for \'' + mapName + '\'');
            }
            return result;
          });
          if (!mapData) {
            throw new Error('Could not find map \'' + mapName + '\'.');
          }
          return mapData.map(value, ...parameters);
        }
        , initialValue) + '';
    };
  };
}
