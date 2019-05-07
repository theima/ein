import { arrayToDict, Dict, get, partial } from '../../core';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { HTMLParser, ModelValueMapData } from '../../html-template';
import { valueMap } from '../../html-template/functions/value.map';
import { templateAttributeToAttribute } from '../../html-template/functions/model-attribute-to-attribute';
import { modelValueMap } from '../../html-template/functions/model-value-map';
import { getWrappedModelValueParts } from '../../html-template/functions/get-wrapped-model-value-parts';
import { stringMap } from '../../html-template/functions/string.map';
import { getAttribute } from './get-attribute';
import { ElementData } from '../../view';
import { HtmlElementData } from '../../html-template/types-and-interfaces/html-element-data';

export function createComponentDataLookup<T>(components: HtmlElementData[], maps: ModelValueMapData[]): (name: string) => ElementData | null {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapDict: Dict<ModelValueMapData> = arrayToDict('name', maps.map(lowerCaseName) as any);
  const tMap = partial(modelValueMap, getAttribute, mapDict);
  const getParts = partial(getWrappedModelValueParts, tMap);
  const sMap = partial(stringMap, getParts);
  const vMap = partial(valueMap, getParts);
  const toAttribute = partial(templateAttributeToAttribute, vMap);
  const parser = partial(HTMLParser, sMap, toAttribute);

  const data: Dict<ElementData> = arrayToDict('name', components.map((data) => {
      const children = parser(data.children);
      return {
        name: data.name,
        children,
        attributes: data.attributes
      };
    }).map(lowerCaseName) as any
  );

  return (name: string) => {
    return get(data, name.toLowerCase());
  };
}
