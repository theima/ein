import { NodeAsync } from '../../node-async';
import { NodeDisposable } from '../../node-disposable';

export type ComponentNode<T> = NodeAsync<T> & NodeDisposable<T>;
