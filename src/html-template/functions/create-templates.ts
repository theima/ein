import { ElementData, NodeElementData } from '../../view';
import { MapData } from '../types-and-interfaces/map-data';
import { arrayToDict, Dict } from '../../core';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';
import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';
import { HTMLParser } from './html-parser';

export function createTemplates(views: Array<HtmlElementData | HtmlNodeElementData>, mapDict: MapData[]): Dict<ElementData | NodeElementData> {
  return arrayToDict('name', views.map(
    (data) => {
      return {...data, content: HTMLParser(data.content)};
    }
    )
  );

}
