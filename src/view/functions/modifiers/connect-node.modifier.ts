import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { TemplateElement } from '../../types-and-interfaces/templates/template-element';
import { NodeAsync } from '../../../node-async';
import { createApplyActionHandlers } from '../create-apply-action-handlers';
import { selectActions } from '../select-actions';
import { Select } from '../../types-and-interfaces/select';
import { Observable } from 'rxjs';
import { Action } from '../../../core';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { claimAttribute } from './claim-attribute';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { Attribute } from '../../types-and-interfaces/attribute';

export function connectNodeModifier(value: boolean,
                                    node: NodeAsync<object>,
                                    templateElement: TemplateElement,
                                    create: (node: NodeAsync<object>,
                                             templateElement: TemplateElement) => ModelToElement,
                                    prev: ModelToElement): ModelToElement {

  const actionAttr = getArrayElement('name', templateElement.attributes, BuiltIn.Actions) as Attribute;
  const actions: (select: Select) => Observable<Action> = actionAttr.value as any;
  let selectWithStream = selectActions(actions);
  const applyActionHandlers = createApplyActionHandlers(selectWithStream.selects);
  node.next(selectWithStream.stream);
  templateElement = claimAttribute(BuiltIn.Connect, templateElement);
  templateElement = claimAttribute(BuiltIn.Actions, templateElement);
  const map = create(node, templateElement);
  return (m, im) => {
    const e: StaticElement = map(m, im) as any;
    return { ...e, content: applyActionHandlers(e.content), actionStream: new Observable<Action>() };
  };
}
