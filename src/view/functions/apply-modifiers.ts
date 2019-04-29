import { ModelToElement } from '..';
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
import { modelModifier } from '../../html-template/functions/modifiers/model.modifier';
import { childNodeModifier } from '../../html-template/functions/modifiers/child-node.modifier';
import { connectNodeModifier } from './modifiers/connect-node.modifier';
import { createElementMap } from './element-map/create-element-map';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { FilledSlot } from '../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../types-and-interfaces/slots/mapped.slot';
import { streamModifier } from './modifiers/stream.modifier';
import { FilledTemplateElement } from '../types-and-interfaces/templates/filled.template-element';

export function applyModifiers(getId: () => number,
                               contentMap: (e: FilledTemplateElement | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot,
                               node: NodeAsync<object>,
                               templateElement: FilledTemplateElement): ModelToElementOrNull | ModelToElements {
  const attrs = templateElement.attributes.map(a => {
    return { ...a, name: a.name.toLowerCase() };
  });
  const getAttr = partial(getArrayElement as any, 'name', attrs);
  const create: (node: NodeAsync<object>, templateElement: TemplateElement) => ModelToElement =
    partial(applyModifiers, getId, contentMap) as any;
  const createElement = (templateElement: TemplateElement) => {
    return create(node, templateElement);
  };
  let map: ModelToElement = null as any;
  const ifAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.If) as any;
  const listAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.List) as any;
  const groupAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.Group) as any;
  const modelAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.Model) as any;
  const nodeAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.NodeMap) as any;
  const connectAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.Connect) as any;
  const actionAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.Actions) as any;

  if (!!ifAttr && typeof ifAttr.value === 'function') {
    return conditionalModifier(ifAttr.value as any, node, templateElement, create, map);
  } else if (!!listAttr && typeof listAttr.value === 'function') {
    return listModifier(templateElement, createElement as any);
  }

  if (modelAttr) {
    return modelModifier(modelAttr.value, node, templateElement, create, map);
  } else if (nodeAttr) {
    return childNodeModifier(nodeAttr.value as any, node, templateElement, create, map);
  }
  if (connectAttr) {
    return connectNodeModifier(connectAttr.value as any, node, templateElement, create, contentMap, map);
  } else if (actionAttr) {
    //right now we need to do this because we know that connectNode handles actions as well.
    return streamModifier(actionAttr.value as any, node, templateElement, create, map);
  }
  if (!!groupAttr) {
    return groupModifier(node, templateElement, create, map);
  }
  const viewId = getId() + '';
  return createElementMap(templateElement, viewId, contentMap);
}
