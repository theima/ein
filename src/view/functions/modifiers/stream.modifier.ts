import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { createApplyActionHandlers } from '../create-apply-action-handlers';
import { getProperty } from '../get-property';
import { selectActions } from '../select-actions';
import { removeProperty } from '../template-element/remove-property';

export function streamModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: FilledElementTemplate) => {
      const actionsProperty = getProperty(BuiltIn.Actions, template);

      if (actionsProperty) {
        let selectWithStream = selectActions(actionsProperty.value as any);
        const applyActionHandlers = createApplyActionHandlers(selectWithStream.selects);
        const actionStream = selectWithStream.stream;
        template = removeProperty(BuiltIn.Actions, template);
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
