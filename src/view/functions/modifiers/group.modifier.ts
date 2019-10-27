import { ElementTemplate, ModelToElement } from '../..';
import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { claimProperty } from './claim-property';

export function groupModifier(node: NodeAsync<Value>,
                              template: ElementTemplate, create: (node: NodeAsync<Value>,
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
