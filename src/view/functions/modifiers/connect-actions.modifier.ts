import { claimProperty } from './claim-property';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { Observable } from 'rxjs';
import { NodeAsync } from '../../../node-async';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { Action } from '../../../core';
import { Select } from '../../types-and-interfaces/select';
import { selectActions } from '../select-actions';
import { createApplyActionHandlers } from '../create-apply-action-handlers';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';

export function connectActionsModifier(value: any,
                                       node: NodeAsync<object>,
                                       template: FilledElementTemplate,
                                       create: (node: NodeAsync<object>,
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
