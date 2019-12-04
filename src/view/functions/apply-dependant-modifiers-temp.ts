import { partial, Value } from '../../core';
import { getArrayElement } from '../../core/functions/get-array-element';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../node-async';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { DynamicProperty } from '../types-and-interfaces/dynamic-property';
import { ModelToElementOrNull } from '../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../types-and-interfaces/elements/model-to-elements';
import { Modifier } from '../types-and-interfaces/modifier';
import { Property } from '../types-and-interfaces/property';
import { FilledSlot } from '../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../types-and-interfaces/slots/mapped.slot';
import { FilledElementTemplate } from '../types-and-interfaces/templates/filled.element-template';
import { createElementMap } from './element-map/create-element-map';
import { connectActionsModifier } from './modifiers/connect-actions.modifier';
import { connectNodeModifier } from './modifiers/connect-node.modifier';
import { streamModifier } from './modifiers/stream.modifier';

export function applyDependantModifiersTemp(getId: () => string,
                                            contentMap: (e: FilledElementTemplate | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot,
                                            node: NodeAsync<Value>,
                                            template: FilledElementTemplate) {
  const viewId = getId();
  const attrs = template.properties.map(a => {
    return { ...a, name: a.name.toLowerCase() };
  });
  const getAttr = partial(getArrayElement as any, 'name', attrs);
  const connectAttr: Property | DynamicProperty = getAttr(BuiltIn.Connect) as any;
  const last = (node: NodeAsync<Value>, template: FilledElementTemplate) => {
    return createElementMap(template, viewId, contentMap);
  };
  //connect actions-modifier
  const connectActions: Modifier = connectActionsModifier;
  const initiatedConnectActions = connectActions(viewId, contentMap);
  const stream: Modifier = streamModifier;
  const initiatedStream = stream(viewId, contentMap);
  const filledConnectActions = initiatedConnectActions(last);
  const filledStream = initiatedStream(filledConnectActions);

  if (connectAttr) {
    return connectNodeModifier(viewId, contentMap, last, node, template);
  }

  return filledStream(node, template);

}
