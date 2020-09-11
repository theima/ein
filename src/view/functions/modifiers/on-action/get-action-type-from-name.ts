import { BuiltIn } from '../../../types-and-interfaces/built-in';

export function getActionTypeFromName(name:string): string {
  return name.substr(BuiltIn.OnAction.length);
}
