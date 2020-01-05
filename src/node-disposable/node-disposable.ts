import { Node } from '../core';

export interface NodeDisposable<T> extends Node<T> {
  dispose: () => void;
}
