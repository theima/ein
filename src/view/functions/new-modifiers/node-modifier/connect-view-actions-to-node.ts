import { Observable } from 'rxjs';
import { Action, Value } from '../../../../core';
import { NodeAsync } from '../../../../node-async';
import { BuiltIn } from '../../../types-and-interfaces/built-in';
import { ElementTemplate } from '../../../types-and-interfaces/templates/element-template';
import { getProperty } from '../../get-property';

export function connectViewActionsToNode(elementTemplate: ElementTemplate, node: NodeAsync<Value>): void {
    const connectActionsProperty = getProperty(BuiltIn.ConnectActionsToNode, elementTemplate);
    const shouldConnect = connectActionsProperty && connectActionsProperty.value === true;
    let toStreamProperty = getProperty(BuiltIn.Actions, elementTemplate);
    if (shouldConnect && toStreamProperty !== undefined) {
      const createStream: () => Observable<Action> = toStreamProperty.value as any;
      const stream: Observable<Action> = createStream();
      node.next(stream);
    }
}
