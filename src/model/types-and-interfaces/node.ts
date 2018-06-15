import { Translator } from './translator';
import { Action } from './action';
import { Subscription ,  PartialObserver } from 'rxjs';
import { ActionMaps } from './action-maps';
import { ActionMap } from './action-map';

export interface Node<T> {
  readonly value: T | null;
  next(action: Action): Action;
  createChild<U>(actionMap: ActionMap<U>, translator: Translator<T, U>): Node<U>;
  createChild<a extends keyof T>(actionMap: ActionMap<T[a]>, property: a): Node<T[a]>;
  createChild<a extends keyof T, b extends keyof T[a]>(actionMap: ActionMap<T[a][b]>, property: a, property2: b): Node<T[a][b]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(actionMap: ActionMap<T[a][b][c]>, property: a, property2: b, property3: c): Node<T[a][b][c]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c]>(actionMap: ActionMap<T[a][b][c][d]>, property: a, property2: b, property3: c, property4: d): Node<T[a][b][c][d]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d]>(actionMap: ActionMap<T[a][b][c][d][e]>, property: a, property2: b, property3: c, property4: d, property5: e): Node<T[a][b][c][d][e]>;

  createChild<U>(actionMaps: ActionMaps<U>, translator: Translator<T, U>): Node<U>;
  createChild<a extends keyof T>(actionMaps: ActionMaps<T[a]>, property: a): Node<T[a]>;
  createChild<a extends keyof T, b extends keyof T[a]>(actionMaps: ActionMaps<T[a][b]>, property: a, property2: b): Node<T[a][b]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(actionMaps: ActionMaps<T[a][b][c]>, property: a, property2: b, property3: c): Node<T[a][b][c]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c]>(actionMaps: ActionMaps<T[a][b][c][d]>, property: a, property2: b, property3: c, property4: d): Node<T[a][b][c][d]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d]>(actionMaps: ActionMaps<T[a][b][c][d][e]>, property: a, property2: b, property3: c, property4: d, property5: e): Node<T[a][b][c][d][e]>;
  subscribe(): Subscription;
  subscribe(observer: PartialObserver<T>): Subscription;
  subscribe(next?: ((value: T) => void), error?: (error: any) => void, complete?: () => void): Subscription;
  dispose(): void;
}
