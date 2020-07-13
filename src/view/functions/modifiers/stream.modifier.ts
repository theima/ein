import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';
import { removeProperty } from '../template-element/remove-property';
import { createApplyActionHandlers } from './stream-modifier/create-apply-action-handlers';
import { createSelectors } from './stream-modifier/selecting-actions/create-selectors';

export function streamModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElements | ModelToElement) => {
    return (node: NodeAsync<Value>, template: ElementTemplate) => {
      const actionsProperty = getProperty(BuiltIn.Actions, template);

      if (actionsProperty) {
        let selectorsAndStream = createSelectors(actionsProperty.value as any);
        const actionSelectsForElement = selectorsAndStream.selects;
        const actionStream = selectorsAndStream.stream;
        const applyActionHandlers = createApplyActionHandlers(actionSelectsForElement);
        template = removeProperty(BuiltIn.Actions, template);
        let properties = template.properties.concat({ name: BuiltIn.ActionStream, value: actionStream });
        template = { ...template, properties };
        const map = next(node, template);
        return (m: Value) => {
          const e: Element = map(m) as any;
          return { ...e, content: applyActionHandlers(e.content) };
        };
      }
      return next(node, template);
    };
  };
}
