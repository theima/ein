import { ElementData, NodeElementData } from '../../view';
import { MapData } from '../types-and-interfaces/map-data';
import { arrayToDict, Dict, partial } from '../../core';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';
import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';
import { HTMLParser } from './html-parser';
import { templateMap } from './template.map';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { templateStringMap } from './template-string.map';
import { Template } from '../types-and-interfaces/template';

export function createTemplates(views: Array<HtmlElementData | HtmlNodeElementData>, maps: MapData[]): Dict<ElementData | NodeElementData> {
  const mapDict = arrayToDict('name', maps);
  const tMap = partial(templateMap, mapDict);
  const tMapToString: (t: Template) => ModelToString = (t: Template) => {
    const result = tMap(t);
    return (m: object) => result(m) + '';
  };
  const sMap = partial(templateStringMap, tMapToString);
  const parser = partial(HTMLParser,sMap);
  return arrayToDict('name', views.map(
    (data) => {
      return {...data, content: parser(data.content)};
    }
    )
  );

}
