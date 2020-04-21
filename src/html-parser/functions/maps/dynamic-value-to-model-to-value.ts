import { Dict, NullableValue, trimArray, Value } from '../../../core';
import { fromDict } from '../../../core/functions/dict/from-dict';
import { ModelToValue } from '../../../core/types-and-interfaces/model-to-value';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ValueMapDescriptor } from '../../types-and-interfaces/descriptors/value-map-descriptor';
import { DynamicStringValue } from '../../types-and-interfaces/dynamic-string-value';
import { parseValueMapParameter } from './parse-value-map-parameter';

export function dynamicValueToModelToValue(getValue: (data: Value, keyString: string) => NullableValue,
                                           maps: Dict<ValueMapDescriptor>,
                                           dynamicValue: DynamicStringValue): ModelToValue {
  return (model: Value) => {
    let parts: string[] = trimArray(dynamicValue.split(BuiltIn.MapSeparator));
    const value: NullableValue = getValue(model, parts.shift() as string);
    if (value === null) {
      return '';
    }
    return parts.reduce((value: Value, part: string, index: number) => {
      const mapAndParameters: string[] = trimArray(part.split(BuiltIn.ParameterSeparator));
      const mapName = mapAndParameters[0].toLowerCase();
      const mapDescriptor: ValueMapDescriptor | undefined = fromDict(maps, mapName);
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
