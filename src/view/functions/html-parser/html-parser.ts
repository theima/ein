import { Dict, partial, Value } from '../../../core';
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';
import { ValueMap } from '../../types-and-interfaces/value-map';
import { dynamicStringToModelToValue } from './dynamic-string-to-model-to-value/dynamic-string-to-model-to-value';
import { attributeToProperty } from './parse-html/attribute-to-property';
import { createElementTemplate } from './parse-html/create-element-template';
import { parseHTML } from './parse-html/parse-html';

export function HTMLParser(maps: Dict<ValueMap>, html: string): ElementTemplateContent[] {
  const toValue = partial(dynamicStringToModelToValue, maps);
  const toString = (s: string) => {
    const result = toValue(s);
    if (typeof result === 'string') {
      return result;
    }
    return (m: Value) => result(m) + '';
  };
  const toElement = partial(createElementTemplate, partial(attributeToProperty, toValue));
  return parseHTML(toString, toElement, html);
}
