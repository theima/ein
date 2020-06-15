import { Observable } from 'rxjs';
import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { Element } from '../../types-and-interfaces/elements/element';
import { ElementContent } from '../../types-and-interfaces/elements/element-content';
import { LiveElement } from '../../types-and-interfaces/elements/live.element';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';

export function elementStreamModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElements | ModelToElement) => {
    return (node: NodeAsync<Value>, template: ElementTemplate) => {
      const elementStreamProperty = getProperty(BuiltIn.ElementStream, template);
      if (elementStreamProperty) {
        let elementStream: Observable<Element> = elementStreamProperty.value as any;
        const willBeDestroyed = () => {
        };

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
        let content: ElementContent = [];
        let element: LiveElement = createElement(content);
        return (m: Value) => {
          return element;
        };
      }
      return next(node, template);
    };
  };

}
