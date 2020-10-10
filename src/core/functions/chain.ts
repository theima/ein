/* eslint-disable */
import { Func } from '../types-and-interfaces/function/function';
import { UnaryFunction } from '../types-and-interfaces/function/unary.function';

export function chain<F extends Func>(last: F, ...functions: Array<UnaryFunction<any, any>>): F {
  return functions.reduceRight((prev: F, curr: UnaryFunction<any, any>) => {
      return curr(prev);
    }, last);
}
