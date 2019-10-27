import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { NodeAsync } from '../../../node-async';
import { createApplyActionHandlers } from '../create-apply-action-handlers';
import { selectActions } from '../select-actions';
import { Select } from '../../types-and-interfaces/select';
import { Observable, ReplaySubject } from 'rxjs';
import { Action, Value } from '../../../core';
import { claimProperty } from './claim-property';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { Property } from '../../types-and-interfaces/property';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { mapContent } from '../element-map/map-content';
import { map } from 'rxjs/operators';
import { LiveElement } from '../../types-and-interfaces/elements/live.element';

export function connectNodeModifier(value: boolean,
                                    node: NodeAsync<Value>,
                                    template: FilledElementTemplate,
                                    create: (node: NodeAsync<Value>,
                                             template: ElementTemplate) => ModelToElement,
                                    contentMap: (e: FilledElementTemplate | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot,
                                    viewId: string,
                                    prev: ModelToElement): ModelToElement {

  const actionAttr = getArrayElement('name', template.properties, BuiltIn.ConnectActions) as Property;
  const actions: (select: Select) => Observable<Action> = actionAttr.value as any;
  let selectWithStream = selectActions(actions);
  const applyActionHandlers = createApplyActionHandlers(selectWithStream.selects);
  node.next(selectWithStream.stream);
  template = claimProperty(BuiltIn.Connect, template);
  template = claimProperty(BuiltIn.ConnectActions, template);
  const mappedContent = template.content.map(contentMap);
  const elements = (m: any) => {
    let content = mapContent('', mappedContent, m, m);

    return applyActionHandlers(content);
  };
  const nodeStream: Observable<any> = node as any;
  const updates = new ReplaySubject<Array<Element | string>>(1);
  const subscription = nodeStream.subscribe(
    m => {
      updates.next(m);
    }, e => {
      updates.error(e);
    },
    () => {
      updates.complete();
    });
  const stream = updates.pipe(map(elements));
  const actionStream = new Observable<Action>();
  const willBeDestroyed = () => {
    subscription.unsubscribe();
    updates.complete();
  };
  return (m, im) => {
    const element: LiveElement = {
      name: template.name,
      id: viewId,
      properties: [],
      childStream: stream,
      actionStream,
      willBeDestroyed
    };

    return element;
  };
}
