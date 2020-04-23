import { Node } from './node';
import { NodeConstructor } from './node-constructor';
export type Mixin<M extends Node<any>, EBase extends NodeConstructor<Node<any>>> = (base: EBase) => NodeConstructor<M>;
