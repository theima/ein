import { ElementTemplateDescriptor } from '../../view';
import { ValueMapDescriptor } from '../types-and-interfaces/descriptors/value-map-descriptor';
import { arrayToDict, Dict, partial } from '../../core';
import { HTMLParser } from './parser/html-parser';
import { dynamicToModelToValue } from './maps/dynamic-to-model-to-value';
import { wrappedToModelToString } from './maps/wrapped-to-model-to-string';
import { attributeToProperty } from './parser/attribute-to-property';
import { wrappedToMappedArray } from './maps/wrappedToMappedArray';
import { wrappedToModelToValue } from './maps/wrapped-to-model-to-value-map';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { getModel } from '../../view/functions/get-model';
import { HtmlElementTemplateDescriptor } from '../types-and-interfaces/descriptors/html-element-template-descriptor';

export function createHtmlMap(maps: ValueMapDescriptor[]): (d: HtmlElementTemplateDescriptor) => ElementTemplateDescriptor {

  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapDict: Dict<ValueMapDescriptor> = arrayToDict('name', maps.map(lowerCaseName) as any);
  const tMap = partial(dynamicToModelToValue, getModel, mapDict);
  const toArray = partial(wrappedToMappedArray, tMap);
  const sMap = partial(wrappedToModelToString, toArray);
  const vMap = partial(wrappedToModelToValue, toArray);
  const toProperty = partial(attributeToProperty, vMap);
  const parser = partial(HTMLParser, sMap, toProperty);
  const map = (descriptor: HtmlElementTemplateDescriptor) => {
    return { ...descriptor, children: parser(descriptor.children) };
  };
  return map;
}
