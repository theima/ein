import { DynamicAttribute, ElementData, NodeElementData } from '../index';
import { NodeAsync } from '../../node-async';
import { isNodeElementData } from './is-node-element-data';
import { Modifier } from '../types-and-interfaces/modifier';
import { conditionalModifier } from './conditional.modifier';
import { get, partial } from '../../core';
import { listModifier } from './list.modifier';
import { getArrayElement } from '../../core/functions/get-array-element';
import { getModel } from '../../html-template/functions/get-model';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { Attribute } from '../types-and-interfaces/attribute';
import { elementMap } from './element.map';

export function childElementMap(getElement: (name: string) => ElementData | NodeElementData | null,
                                templateElement: TemplateElement,
                                node: NodeAsync<any>,
                                elementData: ElementData | NodeElementData | null,
                                usedViews: string[]) {
  const createNode = (node: NodeAsync<object>, data: NodeElementData, attributes: Array<Attribute | DynamicAttribute>) => {
    const childSelectors: string[] = data.createChildFrom(attributes);
    // @ts-ignore-line
    return node.createChild(data.actionMapOrActionMaps, ...childSelectors);
  };
  const createNodeChildIfNeeded = (node: NodeAsync<object>) => {
    if (isNodeElementData(elementData)) {
      return createNode(node, elementData, templateElement.attributes);
    }
    return node;
  };

  if (elementData) {
    if (!elementData.templateValidator(templateElement.attributes)) {
      // just throwing for now until we have decided on how we should handle errors.
      throw new Error('missing or invalid required property for \'' + elementData.name + '\'');
    }
  }

  let activeNode: NodeAsync<object>;
  const attrs = templateElement.attributes.map(a => {
    return {...a, name: a.name.toLowerCase()};
  });
  const getAttr = partial(getArrayElement as any, 'name', attrs);
  const createMap = () => {
    activeNode = createNodeChildIfNeeded(node);
    let modelMap;
    if (elementData) {
      const modelAttr: Attribute | DynamicAttribute = getAttr(Modifier.Model) as any;
      if (modelAttr && typeof modelAttr !== 'function') {
        const keys = modelAttr ? modelAttr.value + '' : '';
        //temporary until modifiers, then node will get its own.
        modelMap = isNodeElementData(elementData) ? (m: object) => get(m, keys) : (m: object) => getModel(m, keys);
      }
    }
    return elementMap(getElement, templateElement, activeNode, elementData, modelMap as any, usedViews);
  };
  const createChild = (templateElement: TemplateElement) => {
    const data: ElementData | null = getElement(templateElement.name);
    return childElementMap(getElement, templateElement, node, data, usedViews);
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
