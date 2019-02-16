import { ComponentElementData } from '../../view/types-and-interfaces/datas/component.element-data';
import { HtmlComponentElementData } from '../types-and-interfaces/html-component-element-data';
import { arrayToDict, Dict, get, partial } from '../../core';
import { lowerCasePropertyValue } from '../../core/functions/lower-case-property-value';
import { HTMLParser, ModelValueMapData } from '../../html-template';
import { valueMap } from '../../html-template/functions/value.map';
import { modelAttributeToAttribute } from '../../html-template/functions/model-attribute-to-attribute';
import { modelValueMap } from '../../html-template/functions/model-value-map';
import { getWrappedModelValueParts } from '../../html-template/functions/get-wrapped-model-value-parts';
import { stringMap } from '../../html-template/functions/string.map';
import { getAttribute } from './get-attribute';
import { ModelToElementOrNull } from '../../view/types-and-interfaces/elements/model-to-element-or-null';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { ModelToElements } from '../../view/types-and-interfaces/elements/model-to-elements';
import { Select, TemplateElement } from '../../view';
import { FilledSlot } from '../../view/types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../../view/types-and-interfaces/slots/mapped.slot';

export function createComponentDataLookup<T>(components: Array<HtmlComponentElementData<T>>, maps: ModelValueMapData[]): (name: string) => ComponentElementData | null {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const mapDict: Dict<ModelValueMapData> = arrayToDict('name', maps.map(lowerCaseName) as any);
  const tMap = partial(modelValueMap, getAttribute, mapDict);
  const getParts = partial(getWrappedModelValueParts, tMap);
  const sMap = partial(stringMap, getParts);
  const vMap = partial(valueMap, getParts);
  const toAttribute = partial(modelAttributeToAttribute, vMap);
  const parser = partial(HTMLParser, sMap, toAttribute);

  const data: Dict<ComponentElementData> = arrayToDict('name', components.map((data) => {
      const children = parser(data.children);
      const createComponent = (id: string,
                               content: Array<TemplateElement | ModelToString | FilledSlot>,
                               create: (elements: Array<TemplateElement | ModelToString | FilledSlot>) => Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>,
                               select: Select) => {
        return data.createComponent(id, content, create, select);
      };
      return {
        name: data.name,
        children,
        createComponent
      };
    }).map(lowerCaseName) as any
  );

  return (name: string) => {
    return get(data, name.toLowerCase());
  };
}
