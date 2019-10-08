import { ModelToElement } from '..';
import { ModelToElements } from '../types-and-interfaces/elements/model-to-elements';
import { ModelToElementOrNull } from '../types-and-interfaces/elements/model-to-element-or-null';
import { DynamicProperty } from '../index';
import { listModifier } from './modifiers/list.modifier';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { Property } from '../types-and-interfaces/property';
import { conditionalModifier } from './modifiers/conditional.modifier';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';
import { partial, Value } from '../../core';
import { getArrayElement } from '../../core/functions/get-array-element';
import { NodeAsync } from '../../node-async';
import { groupModifier } from './modifiers/group.modifier';
import { modelModifier } from './modifiers/model.modifier';
import { childNodeModifier } from './modifiers/child-node.modifier';
import { connectNodeModifier } from './modifiers/connect-node.modifier';
import { createElementMap } from './element-map/create-element-map';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { FilledSlot } from '../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../types-and-interfaces/slots/mapped.slot';
import { streamModifier } from './modifiers/stream.modifier';
import { FilledElementTemplate } from '../types-and-interfaces/templates/filled.element-template';
import { connectActionsModifier } from './modifiers/connect-actions.modifier';

export function applyModifiers(getId: () => string,
                               contentMap: (e: FilledElementTemplate | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot,
                               node: NodeAsync<Value>,
                               template: FilledElementTemplate): ModelToElementOrNull | ModelToElements {
  const viewId = getId();
  const attrs = template.properties.map(a => {
    return { ...a, name: a.name.toLowerCase() };
  });
  const getAttr = partial(getArrayElement as any, 'name', attrs);
  const create: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElement =
    partial(applyModifiers, getId, contentMap) as any;
  const createElement = (template: ElementTemplate) => {
    return create(node, template);
  };
  let map: ModelToElement = null as any;
  const ifAttr: Property | DynamicProperty = getAttr(BuiltIn.If) as any;
  const listAttr: Property | DynamicProperty = getAttr(BuiltIn.List) as any;
  const groupAttr: Property | DynamicProperty = getAttr(BuiltIn.Group) as any;
  const modelAttr: Property | DynamicProperty = getAttr(BuiltIn.Model) as any;
  const nodeAttr: Property | DynamicProperty = getAttr(BuiltIn.NodeMap) as any;
  const connectAttr: Property | DynamicProperty = getAttr(BuiltIn.Connect) as any;
  const connectActionAttr: Property | DynamicProperty = getAttr(BuiltIn.ConnectActions) as any;
  const actionAttr: Property | DynamicProperty = getAttr(BuiltIn.Actions) as any;

  if (!!ifAttr && typeof ifAttr.value === 'function') {
    return conditionalModifier(ifAttr.value as any, node, template, create, map);
  } else if (!!listAttr && typeof listAttr.value === 'function') {
    return listModifier(template, createElement as any);
  }

  if (modelAttr) {
    return modelModifier(modelAttr.value, node, template, create, map);
  } else if (nodeAttr) {
    return childNodeModifier(nodeAttr.value as any, node, template, create, map);
  }
  if (connectAttr) {
    return connectNodeModifier(connectAttr.value as any, node, template, create, contentMap, viewId, map);
  } else if (connectActionAttr) {
    return connectActionsModifier(connectActionAttr.value as any, node, template, create, contentMap, viewId, map);
  }
  if (actionAttr) {
    return streamModifier(actionAttr.value as any, node, template, create, map);
  }
  if (!!groupAttr) {
    return groupModifier(node, template, create, map);
  }

  return createElementMap(template, viewId, contentMap);
}
