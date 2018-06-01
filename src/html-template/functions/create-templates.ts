import { ElementData, NodeElementData } from '../../view';
import { MapData } from '../types-and-interfaces/map-data';
import { arrayToDict, Dict, get, partial } from '../../core';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';
import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';
import { HTMLParser } from './html-parser';
import { templateMap } from './template.map';
import { stringMap } from './string.map';
import { templateAttributeToAttribute } from './template-attribute-to-attribute';
import { getTemplateStringParts } from './get-template-string-parts';
import { valueMap } from './value.map';

export function createTemplates(views: Array<HtmlElementData | HtmlNodeElementData>, maps: MapData[]): (name: string) => ElementData | NodeElementData | null {
  const lowerCase: <T, k extends keyof T>(p: k, array: T[]) => T[] = (key: string, a) => {
    return a.map(
      i => {
        return {...(i as any), [key]: i[key].toLowerCase()};
      });
  };
  const lowerCaseName = partial(lowerCase as any, 'name');
  const mapDict: Dict<MapData> = arrayToDict('name', lowerCaseName(maps) as any);
  const tMap = partial(templateMap, mapDict);
  const getParts = partial(getTemplateStringParts, tMap);
  const sMap = partial(stringMap, getParts);
  const vMap = partial(valueMap, getParts);
  const toAttribute = partial(templateAttributeToAttribute, vMap);
  const parser = partial(HTMLParser, sMap, toAttribute);
  const elements = arrayToDict('name', lowerCaseName(views.map((data) => {
      return {...data, content: parser(data.content)};
    })) as any
  );
  return (name: string) => {
    return get(elements, name.toLowerCase());
  };
}
