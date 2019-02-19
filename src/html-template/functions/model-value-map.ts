import { ModelValue } from '../types-and-interfaces/model-value';
import { Dict, get, trimArray } from '../../core/';
import { parseModelValueMapParameter } from './parse-model-value-map-parameter';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { ModelValueMapData } from '../types-and-interfaces/model-value-map-data';
import { Model } from '../../core/types-and-interfaces/model';
import { fromDict } from '../../core/functions/from-dict';

export function modelValueMap(getValue: (data: object, keyString: string) => Model | null, maps: Dict<ModelValueMapData>, modelValue: ModelValue): (m: object) => object | string | number | boolean {
  return (model: object) => {
    let parts: string[] = trimArray(modelValue.split(BuiltIn.MapSeparator));
    const value: Model | null = getValue(model, parts.shift() as string);
    if (value === null) {
      return '';
    }
    return parts.reduce((value: object | string | number | boolean, part: string, index: number) => {
      const mapAndParameters = trimArray(part.split(BuiltIn.ParameterSeparator));
      const mapName = mapAndParameters[0].toLowerCase();
      const mapData: ModelValueMapData | null = fromDict(maps, mapName);
      const parameters = mapAndParameters.slice(1).map((param) => {
        const result = parseModelValueMapParameter(model, param);
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
      , value);

  };
}
