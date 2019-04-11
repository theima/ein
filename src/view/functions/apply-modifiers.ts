import { ModelMap, ModelToElement } from '..';
import { ModelToElements } from '../types-and-interfaces/elements/model-to-elements';
import { ModelToElementOrNull } from '../types-and-interfaces/elements/model-to-element-or-null';
import { DynamicAttribute } from '../index';
import { listModifier } from './modifiers/list.modifier';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { Attribute } from '../types-and-interfaces/attribute';
import { conditionalModifier } from './modifiers/conditional.modifier';
import { TemplateElement } from '../types-and-interfaces/templates/template-element';
import { partial } from '../../core';
import { getArrayElement } from '../../core/functions/get-array-element';
import { NodeAsync } from '../../node-async';
import { groupModifier } from './modifiers/group.modifier';
import { containsAttribute } from './contains-attribute';
import { modelModifier } from '../../html-template/functions/modifiers/model.modifier';
import { childNodeModifier } from '../../html-template/functions/modifiers/child-node.modifier';

export function applyModifiers(node: NodeAsync<object>,
                               create: (node: NodeAsync<object>,
                                        templateElement: TemplateElement,
                                        modelMap: ModelMap) => ModelToElement,
                               templateElement: TemplateElement): ModelToElementOrNull | ModelToElements {
  const attrs = templateElement.attributes.map(a => {
    return { ...a, name: a.name.toLowerCase() };
  });
  const getAttr = partial(getArrayElement as any, 'name', attrs);
  const createElement = (templateElement: TemplateElement) => {

    let modelMap = null;
    const modelAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.Model) as any;
    const nodeAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.NodeMap) as any;
    if (nodeAttr) {
      return childNodeModifier(nodeAttr.value as any, node, templateElement, create);
    } else if (modelAttr) {
      return modelModifier(modelAttr.value, node, templateElement, create);
    }
    return create(node, templateElement, modelMap as any);
  };

  let map: ModelToElementOrNull | ModelToElements = createElement(templateElement);
  const ifAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.If) as any;
  const listAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.List) as any;
  const groupAttr: Attribute = getAttr(BuiltIn.Group) as any;
  if (!!ifAttr && typeof ifAttr.value === 'function') {
    const ifMap = conditionalModifier(partial(createElement, templateElement), map);
    const isNode = containsAttribute(BuiltIn.NodeMap, templateElement.attributes);
    map = (m: object, im: object) => {
      const result = ifMap(m, im);
      if (!result) {
        if (isNode) {
          node.dispose();
        }
      }
      return result;
    };

  } else if (!!listAttr && typeof listAttr.value === 'function') {
    map = listModifier(templateElement, createElement as any);
  } else if (!!groupAttr) {
    map = groupModifier(templateElement, createElement as any);
  }
  return map;
}
