import { DynamicStringValue } from '../../types-and-interfaces/dynamic-string-value';
import { Dict, trimArray } from '../../../core';
import { parseValueMapParameter } from './parse-value-map-parameter';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ValueMapDescriptor } from '../../types-and-interfaces/descriptors/value-map-descriptor';
import { Value } from '../../../core/types-and-interfaces/value';
import { fromDict } from '../../../core/functions/from-dict';
import { ModelToValue } from '../../../view/types-and-interfaces/model-to-value';

export function dynamicValueToModelToValue(getValue: (data: object, keyString: string) => Value | null,
                                           maps: Dict<ValueMapDescriptor>,
                                           dynamicValue: DynamicStringValue): ModelToValue {
  return (model: object) => {
    let parts: string[] = trimArray(dynamicValue.split(BuiltIn.MapSeparator));
    const value: Value | null = getValue(model, parts.shift() as string);
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
