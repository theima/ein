import { Observable } from 'rxjs';
import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { Element } from '../../types-and-interfaces/elements/element';
import { ElementContent } from '../../types-and-interfaces/elements/element-content';
import { LiveElement } from '../../types-and-interfaces/elements/live.element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { eavesdrop } from '../eavesdrop';
import { getProperty } from '../get-property';

export function elementStreamModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: FilledElementTemplate) => {
      const elementStreamProperty = getProperty(BuiltIn.ElementStream, template);
      if (elementStreamProperty) {
        let elementStream: Observable<Element> = elementStreamProperty.value as any;
        const willBeDestroyed = () => {
        };
        const elementUpdate = (e: Element) => {
         element = createElement(e.content);
        };
        elementStream = eavesdrop(elementStream, elementUpdate);
        const createElement = (content: ElementContent) => {
          return {
            name: template.name,
            id: viewId,
            properties: [],
            content,
            elementStream,
            willBeDestroyed
          };
        };
        let content: ElementContent = ['live'];
        let element: LiveElement = createElement(content);

        return (m: Value, im: Value) => {
          return element;
        };
      }
      return next(node, template);
    };
  };

}
