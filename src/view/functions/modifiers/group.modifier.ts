import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ModelToElement, ElementTemplate } from '../..';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { claimProperty } from './claim-property';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { NodeAsync } from '../../../node-async';
import { Value } from '../../../core';

export function groupModifier(node: NodeAsync<object>,
                              template: ElementTemplate, create: (node: NodeAsync<object>,
                                                                  template: ElementTemplate) => ModelToElement,
                              prev: ModelToElement): ModelToElements {
  template = claimProperty(BuiltIn.Group, template);
  const map = create(node, template);
  return (m: Value, im: Value) => {
    //We know that the element delivered from a group will be static.
    const group: StaticElement = map(m, im) as any;
    return group.content;
  };
}
