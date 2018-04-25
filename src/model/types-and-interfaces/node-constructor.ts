import { Node } from './node';
export type NodeConstructor<N extends Node<any>> = new (...args: any[]) => N;
