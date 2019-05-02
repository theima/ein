import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { TemplateElement } from '../../types-and-interfaces/templates/template-element';
import { NodeAsync } from '../../../node-async';
import { createApplyActionHandlers } from '../create-apply-action-handlers';
import { selectActions } from '../select-actions';
import { Select } from '../../types-and-interfaces/select';
import { Observable } from 'rxjs';
import { Action } from '../../../core';
import { claimAttribute } from './claim-attribute';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { Attribute } from '../../types-and-interfaces/attribute';
import { FilledTemplateElement } from '../../types-and-interfaces/templates/filled.template-element';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { mapContent } from '../element-map/map-content';
import { map } from 'rxjs/operators';
import { LiveElement } from '../../types-and-interfaces/elements/live.element';

export function connectNodeModifier(value: boolean,
                                    node: NodeAsync<object>,
                                    templateElement: FilledTemplateElement,
                                    create: (node: NodeAsync<object>,
                                             templateElement: TemplateElement) => ModelToElement,
                                    contentMap: (e: FilledTemplateElement | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot,
                                    viewId: string,
                                    prev: ModelToElement): ModelToElement {

  const actionAttr = getArrayElement('name', templateElement.attributes, BuiltIn.Actions) as Attribute;
  const actions: (select: Select) => Observable<Action> = actionAttr.value as any;
  let selectWithStream = selectActions(actions);
  const applyActionHandlers = createApplyActionHandlers(selectWithStream.selects);
  node.next(selectWithStream.stream);
  templateElement = claimAttribute(BuiltIn.Connect, templateElement);
  templateElement = claimAttribute(BuiltIn.Actions, templateElement);
  const mappedContent = templateElement.content.map(contentMap);
  const elements = (m: any) => {
    let content = mapContent('', mappedContent, m, m);

    return applyActionHandlers(content);
  };
  const stream = (node as any).pipe(map(elements));
  const actionStream = new Observable<Action>();
  const willBeDestroyed = () => {
    //
  };
  return (m, im) => {
     const element: LiveElement = {
      name: templateElement.name,
      id: viewId,
      attributes: [],
      childStream: stream,
      actionStream,
      willBeDestroyed
    };

     return element;
  };
}
