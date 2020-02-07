import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';

export function connectNodeModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: ElementTemplate) => {
      const connectProperty = getProperty(BuiltIn.ConnectToNodeStream, template);
      if (connectProperty) {
        const result = next(node, template);
        const elementMap = (m: any) => {
          return result(m) as any;
        };
        const nodeStream: Observable<any> = node as any;
        const elementStream = nodeStream.pipe(map(elementMap));
        let properties = template.properties.concat([{ name: BuiltIn.ElementStream, value: elementStream }]);
        template = { ...template, properties} as any;
      }
      return next(node, template);
    };
  };

}
