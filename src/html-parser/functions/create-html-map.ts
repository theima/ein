import { ElementTemplateDescriptor } from '../../view';
import { ValueMapDescriptor } from '../types-and-interfaces/descriptors/value-map-descriptor';
import { arrayToDict, Dict, partial } from '../../core';
import { HTMLParser } from './parser/html-parser';
import { dynamicValueToModelToValue } from './maps/dynamic-value-to-model-to-value';
import { dynamicStringToModelToString } from './maps/dynamic-string-to-model-to-string';
import { attributeToProperty } from './parser/attribute-to-property';
import { dynamicStringToMappedArray } from './maps/dynamic-string-to-mapped-array';
import { dynamicStringToModelToValue } from './maps/dynamic-string-to-model-to-value-map';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { getModel } from '../../view/functions/get-model';
import { HtmlElementTemplateDescriptor } from '../types-and-interfaces/descriptors/html-element-template-descriptor';

export function createHtmlMap(maps: ValueMapDescriptor[]): (d: HtmlElementTemplateDescriptor) => ElementTemplateDescriptor {

  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapDict: Dict<ValueMapDescriptor> = arrayToDict('name', maps.map(lowerCaseName) as any);
  const dynamicValueToValue = partial(dynamicValueToModelToValue, getModel, mapDict);
  const toArray = partial(dynamicStringToMappedArray, dynamicValueToValue);
  const toString = partial(dynamicStringToModelToString, toArray);
  const toValue = partial(dynamicStringToModelToValue, toArray);
  const toProperty = partial(attributeToProperty, toValue);
  const parser = partial(HTMLParser, toString, toProperty);
  const map = (descriptor: HtmlElementTemplateDescriptor) => {
    return { ...descriptor, children: parser(descriptor.children) };
  };
  return map;
}
