import { DynamicProperty } from '../../../types-and-interfaces/element-template/dynamic-property';
import { ElementTemplate } from '../../../types-and-interfaces/element-template/element-template';
import { Property } from '../../../types-and-interfaces/element-template/property';
import { HTMLAttribute } from '../../../types-and-interfaces/html-parser/html-attribute';

export function createElementTemplate(
  toProperty: (a: HTMLAttribute) => Property | DynamicProperty,
  name: string,
  attributes: HTMLAttribute[]
): ElementTemplate {
  return {
    name,
    content: [],
    properties: attributes.map(toProperty),
  };
}
