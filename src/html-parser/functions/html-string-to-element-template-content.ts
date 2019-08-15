import { ValueMapDescriptor } from '../types-and-interfaces/descriptors/value-map-descriptor';
import { partial, arrayToDict, Dict } from '../../core';
import { attributeToProperty } from './parser/attribute-to-property';
import { dynamicStringToModelToValue } from './maps/dynamic-string-to-model-to-value-map';
import { dynamicStringToModelToString } from './maps/dynamic-string-to-model-to-string';
import { dynamicStringToMappedArray } from './maps/dynamic-string-to-mapped-array';
import { dynamicValueToModelToValue } from './maps/dynamic-value-to-model-to-value';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { getModel } from '../../view/functions/get-model';
import { HTMLParser } from './parser/html-parser';
import { ElementTemplate } from '../../view';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { Slot } from '../../view/types-and-interfaces/slots/slot';

export function htmlStringToElementTemplateContent(maps: ValueMapDescriptor[] = []): (s: string) => Array<ElementTemplate | ModelToString | Slot> {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapDict: Dict<ValueMapDescriptor> = arrayToDict('name', maps.map(lowerCaseName) as any);
  const dynamicValueToValue = partial(dynamicValueToModelToValue, getModel, mapDict);
  const toArray = partial(dynamicStringToMappedArray, dynamicValueToValue);
  const toString = partial(dynamicStringToModelToString, toArray);
  const toValue = partial(dynamicStringToModelToValue, toArray);
  const toProperty = partial(attributeToProperty, toValue);
  return partial(HTMLParser, toString, toProperty);
}
