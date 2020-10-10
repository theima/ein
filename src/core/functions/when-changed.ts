import { UnaryFunction } from '../types-and-interfaces/function/unary.function';

export function whenChanged<A>(
  f: UnaryFunction<A, void>
): UnaryFunction<A, void> {
  let last: A;
  return (a: A) => {
    if (a !== last) {
      f(a);
      last = a;
    }
  };
}
