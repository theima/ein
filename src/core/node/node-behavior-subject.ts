import { ConnectableObservable, Observable, Subject, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  publishBehavior,
  takeUntil,
  takeWhile,
  tap
} from 'rxjs/operators';
import { isString } from '../functions/type-guards/is-string';
import { toTranslator } from './functions/to-translator';
import { isTranslator } from './functions/type-guards/is-translator';
import { isTrigger } from './functions/type-guards/is-trigger';
import { NodeFactory } from './node.factory';
import { Action } from './types-and-interfaces/action';
import { Node } from './types-and-interfaces/node';
import { Reducer } from './types-and-interfaces/reducer';
import { Translator } from './types-and-interfaces/translator';
import { Trigger } from './types-and-interfaces/trigger';
import { Update } from './types-and-interfaces/update';

export class NodeBehaviorSubject<T>
  extends Observable<Readonly<T>>
  implements Node<T> {
  protected mapAction: (action: Action) => Action;
  protected mapTriggeredAction: (model: T, action?: Action) => T;
  protected _updates: Subject<Update<T>> = new Subject<Update<T>>();
  protected disposed: boolean = false;
  protected wasDisposed: Subject<boolean> = new Subject<boolean>();
  protected stream!: Observable<T>;
  constructor(
    protected model: T,
    protected reducer: Reducer<T>,
    protected factory: NodeFactory,
    stream?: Observable<T>
  ) {
    super();
    this.mapAction = (action: Action) => {
      const model = this.reducer(this.model, action);
      const update: Update<T> = { action, model }
      this.updated(update);
      return action;
    };
    this.mapTriggeredAction = (model: T, action?: Action) => {
      if (!!action) {
        return this.reducer(model, action);
      }
      return model;
    };
    this.initiate(model, stream)
  }

  public get value(): T {
    return this.model;
  }

  public get updates(): Observable<Update<T>> {
    return this._updates;
  }

  public next(action: Action): Action {
    return this.executeAction(action);
  }

  public subscribe(...args: any[]): Subscription {
    return this.stream.subscribe(...args);
  }

  public createChild<U>(
    reducer: Reducer<U>,
    b: Translator<T, U> | string | Trigger<T, U>,
    c?: Translator<T, U> | string,
    ...properties: string[]
  ): Node<U> {
    const trigger: Trigger<T, U> | undefined = isTrigger(b) ? b : undefined;
    let translator = isTranslator(b) ? b : isTranslator(c) ? c : undefined;
    if (!translator) {
      const props: string[] = [];
      if (isString(b)) {
        props.push(b);
      }
      if (isString(c)) {
        props.push(c);
      }
      translator = toTranslator(...props.concat(properties));
    }

    const child = this.initiateChild(translator.get, reducer);
    this.connectToChild(child, translator.give, trigger);
    return child;
  }

  public dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
      this.wasDisposed.next(true);
      this.wasDisposed.complete();
      this._updates.complete();
    }
  }

  protected createRootStream(initialValue: T): Observable<T> {
    const stream: ConnectableObservable<T> = this._updates.pipe(
      map((update: Update<T>) => {
        return update.model;
      }),
      publishBehavior(initialValue)
    ) as ConnectableObservable<T>;
    stream.connect();
    return stream;
  }

  protected createCompletingStream(stream: Observable<T>): Observable<T> {
    return stream.pipe(
      takeWhile((model: T) => {
        return model !== undefined;
      }),
      takeUntil(this.wasDisposed),
      tap({
        complete: () => {
          this.dispose();
        }
      })
    );
  }

  protected connectModelUpdates(): void {
    // Node must listen on stream because children are not responsible of their model, any parent might change it during an update
    this.stream.subscribe((model: T) => {
      this.model = model;
    });
  }

  protected executeAction(action: Action): Action {
    return this.mapAction(action);
  }

  protected initiate(model: T, stream?: Observable<T>): void {
    this.stream = this.createCompletingStream(stream ?? this.createRootStream(model));
    this.connectModelUpdates();
  }

  protected initiateChild<U>(
    getFunc: (m: T) => U,
    reducer: Reducer<U>
  ): NodeBehaviorSubject<U> {
    const model: U = getFunc(this.model);
    const childStream = this.pipe(map(getFunc), distinctUntilChanged());
    return this.factory.createNode(model, reducer, childStream);
  }

  protected mapChildUpdates<U>(
    child: NodeBehaviorSubject<any>,
    giveFunc: (m: T, mm: U) => T,
    trigger?: Trigger<T, U>
  ): Observable<Update<T>> {
    return child.updates.pipe(
      map((childUpdate: Update<U>) => {
        let model: T = giveFunc(this.model, childUpdate.model);
        const triggeredAction = trigger?.(model, childUpdate);
        model = this.mapTriggeredAction(model, triggeredAction);
        const update: Update<T> = {
          action: triggeredAction,
          childUpdate,
          model
        }
        return update;
      })
    );
  }

  protected connectToChild<U>(
    child: NodeBehaviorSubject<any>,
    giveFunc: (m: T, mm: U) => T,
    trigger?: Trigger<T, U>
  ): void {
    const updates = this.mapChildUpdates(child, giveFunc, trigger);
    updates.subscribe((value: Update<T>) => {
      this.updated(value);
    });
  }

  protected updated(update: Update<T>): void {
    this._updates.next(update);
  }
}
