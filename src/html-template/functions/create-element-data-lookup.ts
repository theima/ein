import { ElementData } from '../../view';
import { ModelValueMapData } from '../types-and-interfaces/model-value-map-data';
import { arrayToDict, Dict, get, partial } from '../../core';
import { HTMLParser } from './html-parser';
import { modelValueMap } from './model-value-map';
import { stringMap } from './string.map';
import { templateAttributeToAttribute } from './model-attribute-to-attribute';
import { getWrappedModelValueParts } from './get-wrapped-model-value-parts';
import { valueMap } from './value.map';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { getModel } from './get-model';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';

export function createElementDataLookup(views: HtmlElementData[], maps: ModelValueMapData[]): (name: string) => ElementData | null {

  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapDict: Dict<ModelValueMapData> = arrayToDict('name', maps.map(lowerCaseName) as any);
  const tMap = partial(modelValueMap, getModel, mapDict);
  const getParts = partial(getWrappedModelValueParts, tMap);
  const sMap = partial(stringMap, getParts);
  const vMap = partial(valueMap, getParts);
  const toAttribute = partial(templateAttributeToAttribute, vMap);
  const parser = partial(HTMLParser, sMap, toAttribute);
  const elements = arrayToDict('name', views.map((data) => {
    return { ...data, children: parser(data.children) };
  }).map(lowerCaseName) as any
  );
  return (name: string) => {
    return get(elements, name.toLowerCase());
  };
}
