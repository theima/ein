import { NodeConstructor } from '../types-and-interfaces/node-constructor';
import { Mixin } from '../types-and-interfaces/mixin';
import { AppliedMixins } from '../types-and-interfaces/applied-mixins';
import { Node } from '../types-and-interfaces/node';
import { makeCreate } from './make-create';
import { makeWithMiddleware } from './make-with-middleware';

export function withMixins<T, M extends Node<T>>(mixin: Mixin<M, NodeConstructor<M>>): AppliedMixins<T, M>;
export function withMixins<T, M extends Node<T>, N extends Node<T>>(mixin1: Mixin<M, NodeConstructor<M>>,
                                                                    mixin2: Mixin<N, NodeConstructor<N>>): AppliedMixins<T, M & N>;
export function withMixins<T, M extends Node<T>, N extends Node<T>, O extends Node<T>>(mixin1: Mixin<M, NodeConstructor<M>>,
                                                                                       mixin2: Mixin<N, NodeConstructor<N>>,
                                                                                       mixin3: Mixin<O, NodeConstructor<O>>): AppliedMixins<T, M & N & O>;
export function withMixins<T, M extends Node<T>, N extends Node<T>, O extends Node<T>, P extends Node<T>>(mixin1: Mixin<M, NodeConstructor<M>>,
                                                                                                          mixin2: Mixin<N, NodeConstructor<N>>,
                                                                                                          mixin3: Mixin<O, NodeConstructor<O>>, mixin4: Mixin<P, NodeConstructor<P>>): AppliedMixins<T, M & N & O & P>;
export function withMixins<T, M extends Node<T>, N extends Node<T>, O extends Node<T>, P extends Node<T>, Q extends Node<T>>(mixin1: Mixin<M, NodeConstructor<M>>,
                                                                                                                             mixin2: Mixin<N, NodeConstructor<N>>,
                                                                                                                             mixin3: Mixin<O, NodeConstructor<O>>,
                                                                                                                             mixin4: Mixin<P, NodeConstructor<P>>,
                                                                                                                             mixin5: Mixin<Q, NodeConstructor<Q>>): AppliedMixins<T, M & N & O & P & Q>;
export function withMixins<T, N extends Node<T>, NBase extends NodeConstructor<N>>(...mixins: Array<Mixin<N, NBase>>): AppliedMixins<T, Node<T>> {
  return {
    create: makeCreate(mixins, []),
    withMiddleware: makeWithMiddleware(mixins as any)
  };
}
