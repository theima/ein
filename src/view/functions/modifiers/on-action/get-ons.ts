import { BuiltIn } from '../../../types-and-interfaces/built-in';
import { ElementTemplate } from '../../../types-and-interfaces/element-template/element-template';
import { Property } from '../../../types-and-interfaces/element-template/property';

export function getOns(elementTemplate:ElementTemplate): Property[] {
  return elementTemplate.properties.filter( (p) => p.name.startsWith(BuiltIn.OnAction));
}
