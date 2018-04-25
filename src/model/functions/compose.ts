import { FuncWithArityOne } from '../types-and-interfaces/func-with-arity-one';
import { Func } from '../types-and-interfaces/function';
import { NodeConstructor, NodeSubject } from '..';
export function compose<N extends NodeSubject<object>, F extends NodeConstructor<N>, E extends NodeConstructor<N>>(last: F, ...functions: Array<FuncWithArityOne<E,E>>): F;
export function compose<F extends Func>(last: F, ...functions: Array<FuncWithArityOne<any, any>>): F;
export function compose<F extends Func>(last: F, ...functions: Array<FuncWithArityOne<any, any>>): F{
  return functions
    .reduceRight((prev: F,
                  curr: FuncWithArityOne<any, any>) => {
      return curr(prev);
    },last);
}
