import { ElementTemplateDescriptor } from '../../view';
import { ModelValueMapDescriptor } from '../types-and-interfaces/model-value-map-descriptor';
import { arrayToDict, Dict, partial } from '../../core';
import { HTMLParser } from './html-parser';
import { modelValueMap } from './model-value-map';
import { stringMap } from './string.map';
import { templateAttributeToProperty } from './model-attribute-to-property';
import { getWrappedModelValueParts } from './get-wrapped-model-value-parts';
import { valueMap } from './value.map';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { getModel } from '../../view/functions/get-model';
import { HtmlElementTemplateDescriptor } from '../types-and-interfaces/html-element-template-descriptor';

export function createHtmlMap(maps: ModelValueMapDescriptor[]): (d: HtmlElementTemplateDescriptor) => ElementTemplateDescriptor {

  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapDict: Dict<ModelValueMapDescriptor> = arrayToDict('name', maps.map(lowerCaseName) as any);
  const tMap = partial(modelValueMap, getModel, mapDict);
  const getParts = partial(getWrappedModelValueParts, tMap);
  const sMap = partial(stringMap, getParts);
  const vMap = partial(valueMap, getParts);
  const toProperty = partial(templateAttributeToProperty, vMap);
  const parser = partial(HTMLParser, sMap, toProperty);
  const map = (descriptor: HtmlElementTemplateDescriptor) => {
    return { ...descriptor, children: parser(descriptor.children) };
  };
  return map;
}
