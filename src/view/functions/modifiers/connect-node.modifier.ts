import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { LiveElement } from '../../types-and-interfaces/elements/live.element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { getProperty } from '../get-property';

export function connectNodeModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: FilledElementTemplate) => {
      const connectProperty = getProperty(BuiltIn.ConnectToNodeStream, template);
      if (connectProperty) {
        const result = next(node, template);
        const elementMap = (m: any) => {
          return result(m, m) as any;
        };
        const nodeStream: Observable<any> = node as any;
        const elementStream = nodeStream.pipe(map(elementMap));
        const willBeDestroyed = () => {
        };
        const element: LiveElement = {
          name: template.name,
          id: viewId,
          properties: [],
          content:[],
          elementStream,
          willBeDestroyed
        };
        return (m: Value, im: Value) => {
          return element;
        };
      }
      return next(node, template);
    };
  };

}
