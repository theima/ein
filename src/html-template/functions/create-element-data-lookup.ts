import { ElementData, NodeViewElementData } from '../../view';
import { ModelValueMapData } from '../types-and-interfaces/model-value-map-data';
import { arrayToDict, Dict, get, partial } from '../../core';
import { ViewHtmlElementData } from '../types-and-interfaces/html-element-data/view.html-element-data';
import { NodeViewHtmlElementData } from '../types-and-interfaces/html-element-data/node-view.html-element-data';
import { HTMLParser } from './html-parser';
import { modelValueMap } from './model-value-map';
import { stringMap } from './string.map';
import { modelAttributeToAttribute } from './model-attribute-to-attribute';
import { getWrappedModelValueParts } from './get-wrapped-model-value-parts';
import { valueMap } from './value.map';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { getModel } from './get-model';
import { GroupHtmlElementData } from '../types-and-interfaces/html-element-data/group.html-element.data';

export function createElementDataLookup(views: Array<ViewHtmlElementData | NodeViewHtmlElementData | GroupHtmlElementData>, maps: ModelValueMapData[]): (name: string) => ElementData | NodeViewElementData | null {

  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapDict: Dict<ModelValueMapData> = arrayToDict('name', maps.map(lowerCaseName) as any);
  const tMap = partial(modelValueMap, getModel, mapDict);
  const getParts = partial(getWrappedModelValueParts, tMap);
  const sMap = partial(stringMap, getParts);
  const vMap = partial(valueMap, getParts);
  const toAttribute = partial(modelAttributeToAttribute, vMap);
  const parser = partial(HTMLParser, sMap, toAttribute);
  const elements = arrayToDict('name', views.map((data) => {
    return { ...data, children: parser(data.children) };
  }).map(lowerCaseName) as any
  );
  return (name: string) => {
    return get(elements, name.toLowerCase());
  };
}
