import { Subscribable } from 'rxjs';
import { Action } from './action';
import { Reducer } from './reducer';
import { Translator } from './translator';
import { Trigger } from './trigger';

export interface Node<T> extends Subscribable<T> {
  readonly value: T;
  next(action: Action): Action;
  createChild<U>(reducer: Reducer<U>, translator: Translator<T, U>): Node<U>;
  createChild<a extends keyof T>(reducer: Reducer<T[a]>, property: a): Node<T[a]>;
  createChild<a extends keyof T, b extends keyof T[a]>(reducer: Reducer<T[a][b]>, property: a, property2: b): Node<T[a][b]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(reducer: Reducer<T[a][b][c]>, property: a, property2: b, property3: c): Node<T[a][b][c]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c]>(reducer: Reducer<T[a][b][c][d]>, property: a, property2: b, property3: c, property4: d): Node<T[a][b][c][d]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d]>(reducer: Reducer<T[a][b][c][d][e]>, property: a, property2: b, property3: c, property4: d, property5: e): Node<T[a][b][c][d][e]>;

  createChild<U>(reducer: Reducer<U>, trigger: Trigger<T>, translator: Translator<T, U>): Node<U>;
  createChild<a extends keyof T>(reducer: Reducer<T[a]>, trigger: Trigger<T>, property: a): Node<T[a]>;
  createChild<a extends keyof T, b extends keyof T[a]>(reducer: Reducer<T[a][b]>, trigger: Trigger<T>, property: a, property2: b): Node<T[a][b]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(reducer: Reducer<T[a][b][c]>, trigger: Trigger<T>, property: a, property2: b, property3: c): Node<T[a][b][c]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c]>(reducer: Reducer<T[a][b][c][d]>, trigger: Trigger<T>, property: a, property2: b, property3: c, property4: d): Node<T[a][b][c][d]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d]>(reducer: Reducer<T[a][b][c][d][e]>, trigger: Trigger<T>, property: a, property2: b, property3: c, property4: d, property5: e): Node<T[a][b][c][d][e]>;
}
