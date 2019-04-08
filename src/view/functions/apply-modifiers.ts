import { ModelMap, ModelToElement } from '..';
import { ModelToElements } from '../types-and-interfaces/elements/model-to-elements';
import { ModelToElementOrNull } from '../types-and-interfaces/elements/model-to-element-or-null';
import { DynamicAttribute, ElementData, NodeViewElementData } from '../index';
import { isNodeElementData } from './type-guards/is-node-element-data';
import { listModifier } from './modifiers/list.modifier';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { Attribute } from '../types-and-interfaces/attribute';
import { conditionalModifier } from './modifiers/conditional.modifier';
import { TemplateElement } from '../types-and-interfaces/templates/template-element';
import { get, partial } from '../../core';
import { getArrayElement } from '../../core/functions/get-array-element';
import { getModel } from '../../html-template/functions/get-model';
import { NodeAsync } from '../../node-async';
import { ComponentElementData } from '../types-and-interfaces/datas/component.element-data';
import { groupModifier } from './modifiers/group.modifier';

export function applyModifiers(create: (node: NodeAsync<object>, templateElement: TemplateElement, elementData: ElementData | NodeViewElementData | null, modelMap: ModelMap) => ModelToElement,
                               getNode: (templateElement: TemplateElement) => NodeAsync<object>,
                               createChild: (templateElement: TemplateElement) => ModelToElementOrNull | ModelToElements,
                               templateElement: TemplateElement,
                               elementData: ElementData | NodeViewElementData | ComponentElementData | null): ModelToElementOrNull | ModelToElements {
  let node: NodeAsync<object>;
  const attrs = templateElement.attributes.map(a => {
    return {...a, name: a.name.toLowerCase()};
  });
  const getAttr = partial(getArrayElement as any, 'name', attrs);
  const createElement = (templateElement: TemplateElement) => {
    node = getNode(templateElement);
    let modelMap;
    const modelAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.Model) as any;
    const nodeAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.SelectChild) as any;
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
    return create(node, templateElement, elementData, modelMap as any);
  };

  let map: ModelToElementOrNull | ModelToElements = createElement(templateElement);
  const ifAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.If) as any;
  const listAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.List) as any;
  const groupAttr: Attribute = getAttr(BuiltIn.Group) as any;
  if (!!ifAttr && typeof ifAttr.value === 'function') {
    const ifMap = conditionalModifier(partial(createElement, templateElement), map);
    map = (m: object, im: object) => {
      const result = ifMap(m, im);
      if (!result) {
        if (isNodeElementData(elementData)) {
          node.dispose();
        }
      }
      return result;
    };

  } else if (!!listAttr && typeof listAttr.value === 'function') {
    map = listModifier(templateElement, createChild as any);
  } else if (!!groupAttr) {
    map = groupModifier(templateElement, createElement as any);
  }
  return map;
}
