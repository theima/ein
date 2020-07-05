import { chain } from '../../functions/chain';
import { UnaryFunction } from '../../types-and-interfaces/function/unary.function';
import { NodeBehaviorSubject } from '../node-behavior-subject';
import { NodeConstructor } from '../types-and-interfaces/node-constructor';

export function chainMixins<N extends NodeBehaviorSubject<object>, F extends NodeConstructor<N>, G extends NodeConstructor<N>, H extends NodeConstructor<N>>(last: F, ...mixins: Array<UnaryFunction<G, G>>): H {
  return chain(last as any, ...mixins);
}
