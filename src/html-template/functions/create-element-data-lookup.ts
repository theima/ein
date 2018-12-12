import { ElementData, NodeElementData } from '../../view';
import { TemplateMapData } from '../types-and-interfaces/template-map-data';
import { arrayToDict, Dict, get, partial } from '../../core';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';
import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';
import { HTMLParser } from './html-parser';
import { templateMap } from './template.map';
import { stringMap } from './string.map';
import { templateAttributeToAttribute } from './template-attribute-to-attribute';
import { getTemplateStringParts } from './get-template-string-parts';
import { valueMap } from './value.map';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { getModel } from './get-model';

export function createElementDataLookup(views: Array<HtmlElementData | HtmlNodeElementData>, maps: TemplateMapData[]): (name: string) => ElementData | NodeElementData | null {

  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapDict: Dict<TemplateMapData> = arrayToDict('name', maps.map(lowerCaseName) as any);
  const tMap = partial(templateMap, getModel, mapDict);
  const getParts = partial(getTemplateStringParts, tMap);
  const sMap = partial(stringMap, getParts);
  const vMap = partial(valueMap, getParts);
  const toAttribute = partial(templateAttributeToAttribute, vMap);
  const parser = partial(HTMLParser, sMap, toAttribute);
  const elements = arrayToDict('name', views.map((data) => {
      return {...data, content: parser(data.content)};
    }).map(lowerCaseName) as any
  );
  return (name: string) => {
    return get(elements, name.toLowerCase());
  };
}
