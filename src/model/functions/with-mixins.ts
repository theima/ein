import { EmceConstructor } from '../types-and-interfaces/emce-constructor';
import { Mixin } from '../types-and-interfaces/mixin';
import { AppliedMixins } from '../types-and-interfaces/applied-mixins';
import { Emce } from '../types-and-interfaces/emce';
import { makeCreate } from './make-create';
import { makeWithMiddleware } from './make-with-middleware';

export function withMixins<T, M extends Emce<T>>(mixin: Mixin<M, EmceConstructor<M>>): AppliedMixins<T, M>;
export function withMixins<T, M extends Emce<T>, N extends Emce<T>>(mixin1: Mixin<M, EmceConstructor<M>>,
                                                                    mixin2: Mixin<N, EmceConstructor<N>>): AppliedMixins<T, M & N>;
export function withMixins<T, M extends Emce<T>, N extends Emce<T>, O extends Emce<T>>(mixin1: Mixin<M, EmceConstructor<M>>,
                                                                                       mixin2: Mixin<N, EmceConstructor<N>>,
                                                                                       mixin3: Mixin<O, EmceConstructor<O>>): AppliedMixins<T, M & N & O>;
export function withMixins<T, M extends Emce<T>, N extends Emce<T>, O extends Emce<T>, P extends Emce<T>>(mixin1: Mixin<M, EmceConstructor<M>>,
                                                                                                          mixin2: Mixin<N, EmceConstructor<N>>,
                                                                                                          mixin3: Mixin<O, EmceConstructor<O>>, mixin4: Mixin<P, EmceConstructor<P>>): AppliedMixins<T, M & N & O & P>;
export function withMixins<T, M extends Emce<T>, N extends Emce<T>, O extends Emce<T>, P extends Emce<T>, Q extends Emce<T>>(mixin1: Mixin<M, EmceConstructor<M>>,
                                                                                                                             mixin2: Mixin<N, EmceConstructor<N>>,
                                                                                                                             mixin3: Mixin<O, EmceConstructor<O>>,
                                                                                                                             mixin4: Mixin<P, EmceConstructor<P>>,
                                                                                                                             mixin5: Mixin<Q, EmceConstructor<Q>>): AppliedMixins<T, M & N & O & P & Q>;
export function withMixins<T, E extends Emce<T>, EBase extends EmceConstructor<E>>(...mixins: Array<Mixin<E, EBase>>): AppliedMixins<T, Emce<T>> {
  return {
    create: makeCreate(mixins, []),
    withMiddleware: makeWithMiddleware(mixins as any)
  };
}
