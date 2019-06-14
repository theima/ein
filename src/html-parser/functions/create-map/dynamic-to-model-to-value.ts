import { DynamicValueString } from '../../types-and-interfaces/dynamic-value-string';
import { Dict, trimArray } from '../../../core';
import { parseValueMapParameter } from './parse-value-map-parameter';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ValueMapDescriptor } from '../../types-and-interfaces/descriptors/value-map-descriptor';
import { Model } from '../../../core/types-and-interfaces/model';
import { fromDict } from '../../../core/functions/from-dict';
import { ModelToValue } from '../../../view/types-and-interfaces/model-to-value';

export function dynamicToModelToValue(getValue: (data: object, keyString: string) => Model | null,
                                      maps: Dict<ValueMapDescriptor>,
                                      dynamic: DynamicValueString): ModelToValue {
  let parts: string[] = trimArray(dynamic.split(BuiltIn.MapSeparator));
  return (model: object) => {
    const value: Model | null = getValue(model, parts.shift() as string);
    if (value === null) {
      return '';
    }
    return parts.reduce((value: object | string | number | boolean, part: string, index: number) => {
      const mapAndParameters = trimArray(part.split(BuiltIn.ParameterSeparator));
      const mapName = mapAndParameters[0].toLowerCase();
      const mapDescriptor: ValueMapDescriptor | null = fromDict(maps, mapName);
      const parameters = mapAndParameters.slice(1).map((param) => {
        const result = parseValueMapParameter(model, param);
        if (result === null) {
          throw new Error('Could not parse parameter\'' + param + '\' for \'' + mapName + '\'');
        }
        return result;
      });
      if (!mapDescriptor) {
        throw new Error('Could not find map \'' + mapName + '\'.');
      }
      return mapDescriptor.map(value, ...parameters);
    }
      , value);

  };
}
