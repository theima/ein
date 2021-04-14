import { Dict, fromDict, NullableValue, Value } from '../../../../core';
import { ModelToValue } from '../../../../core/types-and-interfaces/model-to-value';
import { DynamicPart } from '../../../types-and-interfaces/html-parser/dynamic-part';
import { ParseString } from '../../../types-and-interfaces/html-parser/parse-string';
import { ValueMap } from '../../../types-and-interfaces/value-map';
import { getModel } from '../../get-model';
import { parseValueMapParameter } from '../parse/parse-value-map-parameter';
import { trimStrings } from './trim-strings';

export function dynamicPartToModelToValue(maps: Dict<ValueMap>, dynamicStringValue: DynamicPart): ModelToValue {
  return (model: Value) => {
    const parts: string[] = trimStrings(dynamicStringValue.split(ParseString.MapSeparator));
    const value: NullableValue | undefined = getModel(model, parts.shift() as string);
    if (value === null || value === undefined) {
      return '';
    }
    return parts.reduce((value: Value, part: string) => {
      const mapAndParameters: string[] = trimStrings(part.split(ParseString.ParameterSeparator));
      const mapName = mapAndParameters[0].toLowerCase();
      const valueMap: ValueMap | undefined = fromDict(maps, mapName);
      const parameters = mapAndParameters.slice(1).map((param) => {
        const result = parseValueMapParameter(model, param);
        if (result === null || result === undefined) {
          throw new Error("Could not parse parameter'" + param + "' for '" + mapName + "'");
        }
        return result;
      });
      if (!valueMap) {
        throw new Error("Could not find map '" + mapName + "'.");
      }
      return valueMap(value, ...parameters);
    }, value);
  };
}
