import { Observable } from 'rxjs';
import { Action, Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';

export function connectActionsToNodeModifier(next: ElementTemplateToDynamicNode) {
  return (template: ElementTemplate, node: NodeAsync<Value>) => {
    const result = next(template, node);
    const connectActionsProperty = getProperty(BuiltIn.ConnectActionsToNode, template);
    const shouldConnect = connectActionsProperty && connectActionsProperty.value === true;
    let toStreamProperty = getProperty(BuiltIn.Actions, template);

    if (shouldConnect && toStreamProperty !== undefined) {
      const createStream: () => Observable<Action> = toStreamProperty.value as any;
      const stream: Observable<Action> = createStream();
      node.next(stream);
    }
    return result;
  };
}
