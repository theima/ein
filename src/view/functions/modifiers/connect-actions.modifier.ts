import { Observable } from 'rxjs';
import { Action, Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { Select } from '../../types-and-interfaces/select';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { createApplyActionHandlers } from '../create-apply-action-handlers';
import { selectActions } from '../select-actions';
import { claimProperty } from './claim-property';

export function connectActionsModifier(value: any,
                                       node: NodeAsync<Value>,
                                       template: FilledElementTemplate,
                                       create: (node: NodeAsync<Value>,
                                                template: ElementTemplate) => ModelToElement,
                                       contentMap: (e: FilledElementTemplate | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements| ModelToString | MappedSlot,
                                       viewId: string,
                                       prev: ModelToElement): ModelToElement {
  const actions: (select: Select) => Observable<Action> = value ;
  let selectWithStream = selectActions(actions);
  const applyActionHandlers = createApplyActionHandlers(selectWithStream.selects);
  node.next(selectWithStream.stream);
  template = claimProperty(BuiltIn.ConnectActions, template);
  const actionStream = new Observable<Action>();
  const map = create(node, template);
  return (m, im) => {
    const e: StaticElement = map(m, im) as any;
    return {...e, actionStream, content:applyActionHandlers(e.content)};
  };
}
