import { Func } from '../types-and-interfaces/function/function';

export function joinFunctions<T extends Func>(func: T, ...funcs: T[]): T {
  if (funcs.length > 0) {
    const all = [func].concat(funcs);
    const f = (...args: any[]) => {
      all.forEach((update) => {
        update(...args);
      });
    };
    return f as T;
  }
  return func;
}
