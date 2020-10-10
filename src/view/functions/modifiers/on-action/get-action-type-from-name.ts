import { ModifierProperty } from '../../../types-and-interfaces/modifier-property';

export function getActionTypeFromName(name: string): string {
  return name.substr(ModifierProperty.OnAction.length);
}
