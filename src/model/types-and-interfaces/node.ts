import { Translator } from './translator';
import { Action } from './action';
import { Subscription } from 'rxjs/Subscription';
import { PartialObserver } from 'rxjs/Observer';
import { Handlers } from './handlers';
import { Executor } from './executor';

export interface Node<T> {
  readonly value: T | null;
  next(action: Action): Action;
  createChild<U>(executor: Executor<U>, translator: Translator<T, U>): Node<U>;
  createChild<a extends keyof T>(executor: Executor<T[a]>, property: a): Node<T[a]>;
  createChild<a extends keyof T, b extends keyof T[a]>(executor: Executor<T[a][b]>, property: a, property2: b): Node<T[a][b]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(executor: Executor<T[a][b][c]>, property: a, property2: b, property3: c): Node<T[a][b][c]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c]>(executor: Executor<T[a][b][c][d]>, property: a, property2: b, property3: c, property4: d): Node<T[a][b][c][d]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d]>(executor: Executor<T[a][b][c][d][e]>, property: a, property2: b, property3: c, property4: d, property5: e): Node<T[a][b][c][d][e]>;

  createChild<U>(handlers: Handlers<U>, translator: Translator<T, U>): Node<U>;
  createChild<a extends keyof T>(handlers: Handlers<T[a]>, property: a): Node<T[a]>;
  createChild<a extends keyof T, b extends keyof T[a]>(handlers: Handlers<T[a][b]>, property: a, property2: b): Node<T[a][b]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(handlers: Handlers<T[a][b][c]>, property: a, property2: b, property3: c): Node<T[a][b][c]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c]>(handlers: Handlers<T[a][b][c][d]>, property: a, property2: b, property3: c, property4: d): Node<T[a][b][c][d]>;
  createChild<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d]>(handlers: Handlers<T[a][b][c][d][e]>, property: a, property2: b, property3: c, property4: d, property5: e): Node<T[a][b][c][d][e]>;
  subscribe(): Subscription;
  subscribe(observer: PartialObserver<T>): Subscription;
  subscribe(next?: ((value: T) => void), error?: (error: any) => void, complete?: () => void): Subscription;
  dispose(): void;
}
