import { ElementData, NodeElementData } from '../../view';
import { MapData } from '../types-and-interfaces/map-data';
import { arrayToDict, Dict, partial } from '../../core';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';
import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';
import { HTMLParser } from './html-parser';
import { templateMap } from './template.map';
import { stringMap } from './string.map';
import { templateAttributeToAttribute } from './template-attribute-to-attribute';
import { getTemplateStringParts } from './get-template-string-parts';
import { valueMap } from './value.map';

export function createTemplates(views: Array<HtmlElementData | HtmlNodeElementData>, maps: MapData[]): Dict<ElementData | NodeElementData> {
  const mapDict = arrayToDict('name', maps);
  const tMap = partial(templateMap, mapDict);
  const getParts = partial(getTemplateStringParts, tMap);
  const sMap = partial(stringMap, getParts);
  const vMap = partial(valueMap, getParts);
  const toAttribute = partial(templateAttributeToAttribute, vMap);
  const parser = partial(HTMLParser, sMap, toAttribute);
  return arrayToDict('name', views.map((data) => {
      return {...data, content: parser(data.content)};
    })
  );

}
