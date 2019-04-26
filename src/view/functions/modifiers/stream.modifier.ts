import { NodeAsync } from '../../../node-async';
import { TemplateElement } from '../../types-and-interfaces/templates/template-element';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { Select } from '../../types-and-interfaces/select';
import { Observable } from 'rxjs';
import { Action } from '../../../core';
import { selectActions } from '../select-actions';
import { createApplyActionHandlers } from '../create-apply-action-handlers';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { claimAttribute } from './claim-attribute';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';

export function streamModifier(value: (select: Select) => Observable<Action> ,
                               node: NodeAsync<object>,
                               templateElement: TemplateElement,
                               create: (node: NodeAsync<object>,
                                        templateElement: TemplateElement) => ModelToElement,
                               prev: ModelToElement): ModelToElement {
  let selectWithStream = selectActions(value);
  const applyActionHandlers = createApplyActionHandlers(selectWithStream.selects);
  const actionStream = selectWithStream.stream;
  templateElement = claimAttribute(BuiltIn.Actions, templateElement);
  const map = create(node, templateElement);
  return (m, im) => {
    const e: StaticElement = map(m, im) as any;
    return { ...e, content: applyActionHandlers(e.content), actionStream };
  };
}
