import { ConnectableObservable, Observable, PartialObserver, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, publishBehavior, takeUntil, takeWhile } from 'rxjs/operators';
import { give } from '../functions/give';
import { isString } from '../functions/type-guards/is-string';
import { get } from '../index';
import { triggerActions } from './functions/trigger-actions';
import { isTranslator } from './functions/type-guards/is-translator';
import { isTrigger } from './functions/type-guards/is-trigger';
import { NodeFactory } from './node.factory';
import { Action } from './types-and-interfaces/action';
import { ActionMap } from './types-and-interfaces/action-map';
import { Node } from './types-and-interfaces/node';
import { Translator } from './types-and-interfaces/translator';
import { Trigger } from './types-and-interfaces/trigger';
import { Update } from './types-and-interfaces/update';

export class NodeBehaviorSubject<T> extends Observable<Readonly<T>> implements Node<T> {
  protected model: T;
  protected actionMap: ActionMap<T>;
  protected mapAction: (action: Action) => Action;
  protected mapTriggeredAction: (model: T, action: Action) => T;
  protected _updates: Subject<Update<T>> = new Subject<Update<T>>();
  protected disposed: boolean = false;
  protected wasDisposed: Subject<boolean> = new Subject<boolean>();
  protected subscriptionCount: number = 0;
  protected factory: NodeFactory;
  protected stream: Observable<T>;
  constructor(m: T,
              aMap: ActionMap<T>,
              factory: NodeFactory,
              stream?: Observable<T>) {
    super();
    this.model = m;
    this.actionMap = aMap;
    this.mapAction = (action: Action) => {
      const model = this.actionMap(this.model as T, action);
      this._updates.next({ actions: [action], model });
      return action;
    };
    this.mapTriggeredAction = (model: T, action: Action) => {
      return this.actionMap(model, action);
    };
    this.factory = factory;
    this.stream = this.createCompletingStream(stream || this.createRootStream(m));
    this.connectModelUpdates();
  }

  public get value(): T | null {
    return this.model;
  }

  public get updates(): Observable<Update<T>> {
    return this._updates;
  }

  public next(action: Action): Action {
    return this.executeAction(action);
  }

  public subscribe(): Subscription;
  public subscribe(observer: PartialObserver<T>): Subscription;
  public subscribe(next?: ((value: T) => void),
                   error?: (error: any) => void,
                   complete?: () => void): Subscription;
  public subscribe(...args: any): Subscription {
    return this.stream.subscribe(...args);
  }

  public createChild<U>(actionMap: ActionMap<U>,
                        b: Translator<T, U> | string | Trigger<T>,
                        c?: Translator<T, U> | string,
                        ...properties: string[]) {

    let giveFunc: (m: T, mm: U) => T;
    let getFunc: (m: T) => U;
    let translator: Translator<T, U> | undefined = isTranslator(b) ? b : isTranslator(c) ? c : undefined;
    let trigger: Trigger<T> | undefined = isTrigger(b) ? b : undefined;
    if (translator) {
      getFunc = translator.get;
      giveFunc = translator.give;
    } else {
      let props: string[] = [];
      if (isString(b)) {
        props.push(b);
      }
      if (isString(c)) {
        props.push(c);
      }
      props = props.concat(properties);
      getFunc = (m: T) => {
        return get<T, U>(m as T, ...props);
      };
      giveFunc = (parentModel: T, childModel: U) => {
        return give(parentModel, childModel, ...props);
      };
    }
    const child = this.initiateChild(getFunc, actionMap);
    this.connectChild(child, giveFunc, trigger);
    return child;
  }

  public dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
      this.wasDisposed.next(true);
    }
  }

  protected createRootStream(initialValue: T | null): Observable<T> {
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
      takeUntil(this.wasDisposed)
      );
  }

  protected connectModelUpdates(): void {
    this.stream.subscribe((model: T) => {
      this.model = model;
    }, () => {
      // .
    }, () => {
      this._updates.complete();
    });
  }

  protected executeAction(action: Action): Action {
    return this.mapAction(action);
  }

  protected initiateChild<U>(getFunc: (m: T) => U, actionMap: ActionMap<U>) {
    let model: U = getFunc(this.model);
    const childStream = this.pipe(
      map(getFunc),
      distinctUntilChanged()
    );
    return this.factory.createNode(model, actionMap, childStream);
  }

  protected connectChild<U>(child: NodeBehaviorSubject<any>, giveFunc: (m: T, mm: U) => T, trigger?: Trigger<T>): void {
    child.updates.subscribe((value: Update<U>) => {
      let model: T = giveFunc(this.model, value.model);
      let actions = value.actions;
      const triggeredActions: Action[] = triggerActions(trigger, model, actions);
      model = triggeredActions.reduce(this.mapTriggeredAction, model);
      this._updates.next({ actions: actions.concat(triggeredActions), model });
    });
  }

}
