import { ModelMap, ModelToElement } from '..';
import { ModelToElements } from '../types-and-interfaces/model-to-elements';
import { ModelToElementOrNull } from '../types-and-interfaces/model-to-element-or-null';
import { DynamicAttribute, ElementData, NodeElementData } from '../index';
import { isNodeElementData } from './is-node-element-data';
import { listModifier } from './list.modifier';
import { Modifier } from '../types-and-interfaces/modifier';
import { Attribute } from '../types-and-interfaces/attribute';
import { conditionalModifier } from './conditional.modifier';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { get, partial } from '../../core';
import { getArrayElement } from '../../core/functions/get-array-element';
import { getModel } from '../../html-template/functions/get-model';
import { NodeAsync } from '../../node-async';
import { ComponentElementData } from '../types-and-interfaces/component-element-data';

export function applyModifiers(create: (templateElement: TemplateElement, node: NodeAsync<object>, elementData: ElementData | NodeElementData | null, modelMap: ModelMap) => ModelToElement,
                               getNode: (templateElement: TemplateElement, elementData: ElementData | NodeElementData | null) => NodeAsync<object>,
                               createChild: (templateElement: TemplateElement) => ModelToElementOrNull | ModelToElements,
                               templateElement: TemplateElement,
                               elementData: ElementData | NodeElementData | ComponentElementData | null): ModelToElementOrNull | ModelToElements {
  let activeNode: NodeAsync<object>;
  const attrs = templateElement.attributes.map(a => {
    return {...a, name: a.name.toLowerCase()};
  });
  const getAttr = partial(getArrayElement as any, 'name', attrs);
  const createMap = () => {
    activeNode = getNode(templateElement, elementData);
    let modelMap;
    const modelAttr: Attribute | DynamicAttribute = getAttr(Modifier.Model) as any;
    const nodeAttr: Attribute | DynamicAttribute = getAttr(Modifier.SelectChild) as any;
    if (nodeAttr) {
      const keys = nodeAttr.value + '';
      modelMap = (m: object) => get(m, keys);
    } else if (modelAttr) {
      if (typeof modelAttr.value === 'string') {
        const keys = modelAttr.value + '';
        modelMap = (m: object) => getModel(m, keys);
      } else {
        throw new Error('Attribute model must be a string for \'' + templateElement.name + '\'');
      }
    }
    return create(templateElement, activeNode, elementData, modelMap as any);
  };

  const map = createMap();
  const ifAttr: Attribute | DynamicAttribute = getAttr(Modifier.If) as any;
  const listAttr: Attribute | DynamicAttribute = getAttr(Modifier.List) as any;
  if (!!ifAttr && typeof ifAttr.value === 'function') {
    const ifMap = conditionalModifier(createMap, map);
    return (m: object) => {
      const result = ifMap(m);
      if (!result && isNodeElementData(elementData)) {
        activeNode.dispose();
      }
      return result;
    };

  } else if (!!listAttr && typeof listAttr.value === 'function') {
    const listMap = listModifier(templateElement, createChild as any);
    return listMap;
  }
  return map;
}
