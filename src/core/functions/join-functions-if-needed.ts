import { Func } from '../types-and-interfaces/function/function';
import { joinFunctions } from './join-functions';

export function joinFunctionsIfNeeded<T extends Func>(
  func: T[]
): T | undefined {
  if (func.length) {
    return joinFunctions(func[0], ...func.slice(1));
  }
}
