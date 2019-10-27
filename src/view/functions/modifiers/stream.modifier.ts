import { NodeAsync } from '../../../node-async';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { Select } from '../../types-and-interfaces/select';
import { Observable } from 'rxjs';
import { Action, Value } from '../../../core';
import { selectActions } from '../select-actions';
import { createApplyActionHandlers } from '../create-apply-action-handlers';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { claimProperty } from './claim-property';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';

export function streamModifier(value: (select: Select) => Observable<Action> ,
                               node: NodeAsync<Value>,
                               template: ElementTemplate,
                               create: (node: NodeAsync<Value>,
                                        template: ElementTemplate) => ModelToElement,
                               prev: ModelToElement): ModelToElement {
  let selectWithStream = selectActions(value);
  const applyActionHandlers = createApplyActionHandlers(selectWithStream.selects);
  const actionStream = selectWithStream.stream;
  template = claimProperty(BuiltIn.Actions, template);
  const map = create(node, template);
  return (m, im) => {
    const e: StaticElement = map(m, im) as any;
    return { ...e, content: applyActionHandlers(e.content), actionStream };
  };
}
