import { NodeConstructor } from './node-constructor';
import { Node } from './node';
export type Mixin<M extends Node<any>, EBase extends NodeConstructor<Node<any>>> = (base: EBase) => NodeConstructor<M>;
