import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ModelToElement, TemplateElement } from '../..';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { claimAttribute } from './claim-attribute';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { NodeAsync } from '../../../node-async';

export function groupModifier(node: NodeAsync<object>,
                              element: TemplateElement, create: (node: NodeAsync<object>,
                                                                 templateElement: TemplateElement) => ModelToElement,
                              prev: ModelToElement): ModelToElements {
  element = claimAttribute(BuiltIn.Group, element);
  const map = create(node, element);
  return (m: object, im: object) => {
    //We know that the element delivered from a group data will be static.
    const group: StaticElement = map(m, im) as any;
    return group.content;
  };
}
