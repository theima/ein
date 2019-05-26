import { ElementData } from '../../view';
import { ModelValueMapData } from '../types-and-interfaces/model-value-map-data';
import { arrayToDict, Dict, partial } from '../../core';
import { HTMLParser } from './html-parser';
import { modelValueMap } from './model-value-map';
import { stringMap } from './string.map';
import { templateAttributeToProperty } from './model-attribute-to-attribute';
import { getWrappedModelValueParts } from './get-wrapped-model-value-parts';
import { valueMap } from './value.map';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { getModel } from './get-model';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';

export function createHtmlMap(maps: ModelValueMapData[]): (d: HtmlElementData) => ElementData {

  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapDict: Dict<ModelValueMapData> = arrayToDict('name', maps.map(lowerCaseName) as any);
  const tMap = partial(modelValueMap, getModel, mapDict);
  const getParts = partial(getWrappedModelValueParts, tMap);
  const sMap = partial(stringMap, getParts);
  const vMap = partial(valueMap, getParts);
  const toProperty = partial(templateAttributeToProperty, vMap);
  const parser = partial(HTMLParser, sMap, toProperty);
  const map = (data: HtmlElementData) => {
    return { ...data, children: parser(data.children) };
  };
  return map;
}
