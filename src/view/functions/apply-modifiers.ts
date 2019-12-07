import { ModelToElement } from '..';
import { partial, Value } from '../../core';
import { getArrayElement } from '../../core/functions/get-array-element';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../node-async';
import { DynamicProperty } from '../index';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { ModelToElementOrNull } from '../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../types-and-interfaces/elements/model-to-elements';
import { Property } from '../types-and-interfaces/property';
import { FilledSlot } from '../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../types-and-interfaces/slots/mapped.slot';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';
import { FilledElementTemplate } from '../types-and-interfaces/templates/filled.element-template';
import { applyDependantModifiersTemp } from './apply-dependant-modifiers-temp';
import { createElementMap } from './element-map/create-element-map';
import { conditionalModifier } from './modifiers/conditional.modifier';
import { groupModifier } from './modifiers/group.modifier';
import { listModifier } from './modifiers/list.modifier';
import { modelModifier } from './modifiers/model.modifier';

export function applyModifiers(getId: () => string,
                               contentMap: (e: FilledElementTemplate | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot,
                               node: NodeAsync<Value>,
                               template: FilledElementTemplate): ModelToElementOrNull | ModelToElements {
  const viewId = getId();
  const attrs = template.properties.map(a => {
    return { ...a, name: a.name.toLowerCase() };
  });
  const getAttr = partial(getArrayElement as any, 'name', attrs);
  const create: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElement = partial(applyModifiers, getId, contentMap) as any;
  const createElement = (template: ElementTemplate) => {
    return create(node, template);
  };
  const ifAttr: Property | DynamicProperty = getAttr(BuiltIn.If) as any;
  const listAttr: Property | DynamicProperty = getAttr(BuiltIn.List) as any;
  const groupAttr: Property | DynamicProperty = getAttr(BuiltIn.Group) as any;
  const modelAttr: Property | DynamicProperty = getAttr(BuiltIn.Model) as any;
  const nodeAttr: Property | DynamicProperty = getAttr(BuiltIn.NodeMap) as any;
  const connectAttr: Property | DynamicProperty = getAttr(BuiltIn.Connect) as any;
  const connectActionAttr: Property | DynamicProperty = getAttr(BuiltIn.ConnectActions) as any;
  const actionAttr: Property | DynamicProperty = getAttr(BuiltIn.Actions) as any;

  if (!!ifAttr && typeof ifAttr.value === 'function') {
    return conditionalModifier(ifAttr.value as any, node, template, create);
  } else if (!!listAttr && typeof listAttr.value === 'function') {
    return listModifier(template, createElement as any);
  }

  if (modelAttr) {
    return modelModifier(modelAttr.value, node, template, create);
  }
  if (nodeAttr || connectAttr || connectActionAttr || actionAttr) {
    return applyDependantModifiersTemp(getId,contentMap,node,template);
  }
  if (!!groupAttr) {
    return groupModifier(node, template, create);
  }

  return createElementMap(template, viewId, contentMap);
}
