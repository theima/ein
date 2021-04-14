import { ElementTemplate } from '../../../types-and-interfaces/element-template/element-template';
import { Property } from '../../../types-and-interfaces/element-template/property';
import { ModifierProperty } from '../../../types-and-interfaces/modifier-property';

export function getOns(elementTemplate: ElementTemplate): Property[] {
  return elementTemplate.properties.filter((p) => p.name.startsWith(ModifierProperty.OnAction));
}
