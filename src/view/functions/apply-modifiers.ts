import { Value } from '../../core';
import { compose } from '../../core/functions/compose';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../node-async';
import { ModelToElementOrNull } from '../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../types-and-interfaces/elements/model-to-elements';
import { Modifier } from '../types-and-interfaces/modifier';
import { FilledSlot } from '../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../types-and-interfaces/slots/mapped.slot';
import { FilledElementTemplate } from '../types-and-interfaces/templates/filled.element-template';
import { createElementMap } from './element-map/create-element-map';
import { childNodeModifier } from './modifiers/child-node.modifier';
import { conditionalModifier } from './modifiers/conditional.modifier';
import { connectActionsModifier } from './modifiers/connect-actions.modifier';
import { connectNodeModifier } from './modifiers/connect-node.modifier';
import { elementStreamModifier } from './modifiers/element-stream.modifier';
import { groupModifier } from './modifiers/group.modifier';
import { listModifier } from './modifiers/list.modifier';
import { modelModifier } from './modifiers/model.modifier';
import { slotStreamModifier } from './modifiers/slot-stream.modifier';
import { streamModifier } from './modifiers/stream.modifier';

export function applyModifiers(getId: () => string,
                               contentMap: (e: FilledElementTemplate | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot,
                               node: NodeAsync<Value>,
                               template: FilledElementTemplate): ModelToElementOrNull | ModelToElements {
  const viewId = getId();
  const last = (node: NodeAsync<Value>, template: FilledElementTemplate) => {
    return createElementMap(template, viewId, contentMap);
  };
  const modifiers: Modifier[] = [conditionalModifier, listModifier, slotStreamModifier, modelModifier, childNodeModifier, connectNodeModifier, streamModifier, connectActionsModifier, elementStreamModifier,groupModifier];
  const initiated = modifiers.map((m) => m(viewId));
  const composed = compose(last, ...initiated);

  return composed(node, template);
}
