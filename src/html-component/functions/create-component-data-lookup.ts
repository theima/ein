import { ComponentElementData } from '../../view/types-and-interfaces/component-element-data';
import { HtmlComponentElementData } from '../types-and-interfaces/html-component-element-data';
import { arrayToDict, Dict, get, partial } from '../../core';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { HTMLParser, TemplateMapData } from '../../html-template';
import { valueMap } from '../../html-template/functions/value.map';
import { templateAttributeToAttribute } from '../../html-template/functions/template-attribute-to-attribute';
import { templateMap } from '../../html-template/functions/template.map';
import { getTemplateStringParts } from '../../html-template/functions/get-template-string-parts';
import { stringMap } from '../../html-template/functions/string.map';
import { getAttribute } from './get-attribute';
import { ModelToElementOrNull } from '../../view/types-and-interfaces/elements/model-to-element-or-null';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { ModelToElements } from '../../view/types-and-interfaces/elements/model-to-elements';
import { Select, TemplateElement } from '../../view';

export function createComponentDataLookup<T>(components: Array<HtmlComponentElementData<T>>, maps: TemplateMapData[]): (name: string) => ComponentElementData | null {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapDict: Dict<TemplateMapData> = arrayToDict('name', maps.map(lowerCaseName) as any);
  const tMap = partial(templateMap, getAttribute, mapDict);
  const getParts = partial(getTemplateStringParts, tMap);
  const sMap = partial(stringMap, getParts);
  const vMap = partial(valueMap, getParts);
  const toAttribute = partial(templateAttributeToAttribute, vMap);
  const parser = partial(HTMLParser, sMap, toAttribute);

  const data: Dict<ComponentElementData> = arrayToDict('name', components.map((data) => {
      const content = parser(data.content);
      const createStream = (content: Array<TemplateElement | ModelToString>, create: (elements: Array<TemplateElement | ModelToString>) => Array<ModelToElementOrNull | ModelToString | ModelToElements>, select: Select) => {
        return data.createStream(content as any, create, select);
      };
      return {
        name: data.name,
        setElementLookup: data.setElementLookup,
        content,
        createStream,
        events: data.events
      };
    }).map(lowerCaseName) as any
  );

  return (name: string) => {
    return get(data, name.toLowerCase());
  };
}
