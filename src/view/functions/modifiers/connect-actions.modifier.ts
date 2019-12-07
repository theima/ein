import { Observable } from 'rxjs';
import { Action, Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { getProperty } from '../get-property';
import { replaceProperty } from './replace-property';

export function connectActionsModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: FilledElementTemplate) => {
      const connectActionsProperty = getProperty(BuiltIn.ConnectActions, template);
      const shouldConnect = connectActionsProperty && connectActionsProperty.value === true;
      let streamProperty = getProperty(BuiltIn.ActionStream, template);

      if (shouldConnect && streamProperty !== null) {
        const stream: Observable<Action> = streamProperty.value as any;
        streamProperty = { name: streamProperty.name, value: new Observable<Action>() };
        template = replaceProperty(streamProperty, template);
        node.next(stream);
        return next(node, template);
      }
      return next(node, template);
    };
  };
}
