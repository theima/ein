import { EmceConstructor } from './emce-constructor';
import { Emce } from './emce';
export type Mixin<M extends Emce<any>, EBase extends EmceConstructor<Emce<any>>> = (base: EBase) => EmceConstructor<M>;
