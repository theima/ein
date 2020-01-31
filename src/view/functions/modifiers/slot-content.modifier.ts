import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';

export function slotContentModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: ElementTemplate) => {
      const slotContentProperty = getProperty(BuiltIn.SlotContent, template);
      const slotStreamProperty = getProperty(BuiltIn.SlotNode, template);
      if (slotContentProperty && slotStreamProperty) {
        let slotContent: ElementTemplate = slotContentProperty.value as any;
        let slotStream: Observable<Value> = slotStreamProperty.value as any;
        const contentMap = next(node, slotContent);
        const elementMap = (m: any) => {
          return contentMap(m) as any;
        };
        const elementStream: Observable<Element> = slotStream.pipe(map(elementMap));
        let properties = slotContent.properties.concat([{ name: BuiltIn.ElementStream, value: elementStream }]);
        template = { ...slotContent, properties} as any;
        }
      return next(node, template);
    };
  };

}
