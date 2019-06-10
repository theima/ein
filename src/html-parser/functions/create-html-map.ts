import { ElementTemplateDescriptor } from '../../view';
import { ValueMapDescriptor } from '../types-and-interfaces/descriptors/value-map-descriptor';
import { arrayToDict, Dict, partial } from '../../core';
import { HTMLParser } from './html-parser';
import { dataMap } from './data-map';
import { stringMap } from './string.map';
import { attributeToProperty } from './attribute-to-property';
import { getWrappedDynamicValueParts } from './get-wrapped-dynamic-value-parts';
import { valueMap } from './value.map';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { getModel } from '../../view/functions/get-model';
import { HtmlElementTemplateDescriptor } from '../types-and-interfaces/descriptors/html-element-template-descriptor';

export function createHtmlMap(maps: ValueMapDescriptor[]): (d: HtmlElementTemplateDescriptor) => ElementTemplateDescriptor {

  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapDict: Dict<ValueMapDescriptor> = arrayToDict('name', maps.map(lowerCaseName) as any);
  const tMap = partial(dataMap, getModel, mapDict);
  const getParts = partial(getWrappedDynamicValueParts, tMap);
  const sMap = partial(stringMap, getParts);
  const vMap = partial(valueMap, getParts);
  const toProperty = partial(attributeToProperty, vMap);
  const parser = partial(HTMLParser, sMap, toProperty);
  const map = (descriptor: HtmlElementTemplateDescriptor) => {
    return { ...descriptor, children: parser(descriptor.children) };
  };
  return map;
}
