import { Observable } from 'rxjs';
import { Action, Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';
import { replaceProperty } from '../template-element/replace-property';

export function connectActionsModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElements | ModelToElement) => {
    return (node: NodeAsync<Value>, template: ElementTemplate) => {
      const connectActionsProperty = getProperty(BuiltIn.ConnectActionsToNode, template);
      const shouldConnect = connectActionsProperty && connectActionsProperty.value === true;
      let streamProperty = getProperty(BuiltIn.ActionStream, template);

      if (shouldConnect && streamProperty !== undefined) {
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
