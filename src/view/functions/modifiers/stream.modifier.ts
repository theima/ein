import { Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { createApplyActionHandlers } from '../create-apply-action-handlers';
import { getProperty } from '../get-property';
import { selectActions } from '../select-actions';
import { claimProperty } from './claim-property';

export function streamModifier(viewId: string,
                               contentMap: (e: FilledElementTemplate | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot) {
  return (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: FilledElementTemplate) => {
      const actionsProperty = getProperty(BuiltIn.Actions, template);

      if (actionsProperty) {
        let selectWithStream = selectActions(actionsProperty.value as any);
        const applyActionHandlers = createApplyActionHandlers(selectWithStream.selects);
        const actionStream = selectWithStream.stream;
        template = claimProperty(BuiltIn.Actions, template);
        let properties = template.properties.concat({ name: BuiltIn.ActionStream, value: actionStream });
        template = { ...template, properties };
        const map = next(node, template);
        return (m: Value, im: Value) => {
          const e: StaticElement = map(m, im) as any;
          return { ...e, content: applyActionHandlers(e.content) };
        };
      }
      return next(node, template);
    };
  };
}
