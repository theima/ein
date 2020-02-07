import { Value } from '../../core';
import { compose } from '../../core/functions/compose';
import { NodeAsync } from '../../node-async';
import { ModelToElementOrNull } from '../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../types-and-interfaces/elements/model-to-elements';
import { Modifier } from '../types-and-interfaces/modifier';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';
import { createModelToElement } from './element-map/create-model-to-element';
import { childNodeModifier } from './modifiers/child-node.modifier';
import { conditionalModifier } from './modifiers/conditional.modifier';
import { connectActionsModifier } from './modifiers/connect-actions.modifier';
import { connectNodeModifier } from './modifiers/connect-node.modifier';
import { elementStreamModifier } from './modifiers/element-stream.modifier';
import { groupModifier } from './modifiers/group.modifier';
import { listModifier } from './modifiers/list.modifier';
import { modelModifier } from './modifiers/model.modifier';
import { slotContentModifier } from './modifiers/slot-content.modifier';
import { streamModifier } from './modifiers/stream.modifier';

export function applyModifiers(getId: () => string,
                               elementMap: (e: ElementTemplate) => ModelToElementOrNull | ModelToElements,
                               node: NodeAsync<Value>,
                               template: ElementTemplate): ModelToElementOrNull | ModelToElements {
  const viewId = getId();
  const last = (node: NodeAsync<Value>, template: ElementTemplate) => {
    return createModelToElement(template, viewId, elementMap);
  };
  const modifiers: Modifier[] = [slotContentModifier, conditionalModifier, listModifier, modelModifier, childNodeModifier, connectNodeModifier, streamModifier, connectActionsModifier, elementStreamModifier, groupModifier];
  const initiated = modifiers.map((m) => m(viewId));
  const composed = compose(last, ...initiated);

  return composed(node, template);
}
